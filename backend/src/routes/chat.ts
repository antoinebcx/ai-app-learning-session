/**
 * POST /api/chat — runs one agent interaction against the OpenAI Responses API
 * and streams every event back to the browser over Server-Sent Events (SSE).
 *
 * The agent loop here is the whole point of the file:
 *   1. Call the model with the current context + available tools (streaming).
 *   2. Forward every event the API emits straight to the client.
 *   3. When the model emits function_call items, run the matching handler
 *      server-side and append a function_call_output to the context.
 *   4. If any tools were called, loop back to step 1 — otherwise we're done.
 *
 * Custom "agent.*" events (turn.started, tool_execution.started/completed,
 * done, error) are interleaved so the frontend can visualise the loop.
 */
import { Router, type Request, type Response } from 'express';
import { openai } from '../openai.js';
import { env } from '../env.js';
import { scenarios } from '../scenarios/index.js';
import type { ToolDef } from '../scenarios/types.js';

export const chatRouter = Router();

type ChatRequest = {
  scenarioId: string;
  /** Array of Responses-API input items: user/assistant messages, function_call items, function_call_output items. */
  input: any[];
  /** Whitelist of tool names (or built-in tool types). If omitted, all scenario tools are enabled. */
  enabledTools?: string[];
  /** Optional override of the scenario's default system instructions. */
  instructionsOverride?: string;
  /** Optional model override (default from env). */
  model?: string;
};

const MAX_AGENT_TURNS = 8;

chatRouter.post('/', async (req: Request, res: Response) => {
  const body = req.body as ChatRequest;
  const scenario = scenarios[body.scenarioId];
  if (!scenario) {
    res.status(404).json({ error: `Unknown scenarioId: ${body.scenarioId}` });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const send = (payload: unknown) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  const activeTools = filterTools(scenario.tools, body.enabledTools);
  const context: any[] = [...body.input];

  try {
    for (let turn = 1; turn <= MAX_AGENT_TURNS; turn++) {
      send({ type: 'agent.turn.started', turn });

      const stream = await openai.responses.create({
        model: body.model ?? env.DEFAULT_MODEL,
        instructions: body.instructionsOverride ?? scenario.defaultInstructions,
        input: context,
        tools: activeTools.length > 0 ? (activeTools as any) : undefined,
        store: false,
        include: ['reasoning.encrypted_content'] as any,
        stream: true,
      });

      let finalResponse: any | undefined;

      for await (const event of stream as any) {
        send(event);
        if (event.type === 'response.completed') {
          finalResponse = event.response;
        }
      }

      if (!finalResponse) {
        send({ type: 'agent.error', message: 'stream ended without response.completed' });
        break;
      }

      context.push(...finalResponse.output);

      const calls = finalResponse.output.filter((item: any) => item.type === 'function_call');
      if (calls.length === 0) {
        break;
      }

      for (const call of calls) {
        const handler = scenario.handlers[call.name];
        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = call.arguments ? JSON.parse(call.arguments) : {};
        } catch {
          /* leave empty */
        }

        send({
          type: 'agent.tool_execution.started',
          name: call.name,
          call_id: call.call_id,
          arguments: parsedArgs,
        });

        let output: unknown;
        if (!handler) {
          output = { error: `No handler registered for tool "${call.name}"` };
        } else {
          try {
            output = await handler(parsedArgs);
          } catch (err: any) {
            output = { error: err?.message ?? 'handler threw' };
          }
        }

        context.push({
          type: 'function_call_output',
          call_id: call.call_id,
          output: typeof output === 'string' ? output : JSON.stringify(output),
        });

        send({
          type: 'agent.tool_execution.completed',
          name: call.name,
          call_id: call.call_id,
          output,
        });
      }
    }

    send({ type: 'agent.done' });
  } catch (err: any) {
    send({ type: 'agent.error', message: err?.message ?? String(err) });
  } finally {
    res.end();
  }
});

function filterTools(all: ToolDef[], enabled?: string[]): ToolDef[] {
  if (!enabled) return all;
  const set = new Set(enabled);
  return all.filter((t) => (t.type === 'function' ? set.has(t.name) : set.has(t.type)));
}
