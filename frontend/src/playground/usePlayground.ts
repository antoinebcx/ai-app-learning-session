/**
 * usePlayground — the single hook that owns playground state.
 *
 * Responsibilities:
 *   - Load scenarios from /api/scenarios on mount.
 *   - Track the selected scenario, the editable system prompt, and which tools are enabled.
 *   - Keep `contextItems` (the canonical Responses-API conversation context) in sync as
 *     the agent loop runs — this is what we ship back to the backend on the next user turn.
 *   - Keep `uiMessages` (a view-model for the chat pane) in sync with what's been streamed.
 *   - Keep a flat list of every SSE `event` for the right-hand event panel.
 *
 * The two collections (contextItems / uiMessages) are intentionally separate:
 * contextItems must match the API's exact shape; uiMessages is just for rendering.
 */
import { useEffect, useRef, useState } from 'react';
import { fetchScenarios, streamChat } from '../lib/api';
import type { ChatEvent, ChatRequest, Scenario } from '../types';

export type UIMessage =
  | { kind: 'user'; text: string }
  | { kind: 'assistant-text'; text: string; streaming?: boolean }
  | {
      kind: 'tool-call';
      callId: string;
      name: string;
      args: unknown;
      output?: unknown;
      status: 'running' | 'done';
    };

export function usePlayground() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState('');
  const [enabledTools, setEnabledTools] = useState<Set<string>>(new Set());

  const [contextItems, setContextItems] = useState<any[]>([]);
  const [uiMessages, setUiMessages] = useState<UIMessage[]>([]);
  const [events, setEvents] = useState<ChatEvent[]>([]);

  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  // Index of the assistant text bubble currently being streamed into.
  const streamingIdxRef = useRef<number>(-1);

  const selected = scenarios.find((s) => s.id === selectedId) ?? null;

  useEffect(() => {
    fetchScenarios()
      .then((list) => {
        setScenarios(list);
        if (list[0]) selectScenario(list[0]);
      })
      .catch((err) => setError(err?.message ?? String(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectScenario(s: Scenario) {
    abortRef.current?.abort();
    setSelectedId(s.id);
    setInstructions(s.defaultInstructions);
    setEnabledTools(
      new Set(s.tools.map((t) => (t.type === 'function' ? t.name : t.type)))
    );
    setContextItems([]);
    setUiMessages([]);
    setEvents([]);
    setError(null);
    setStreaming(false);
    streamingIdxRef.current = -1;
  }

  function toggleTool(key: string) {
    setEnabledTools((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function resetConversation() {
    abortRef.current?.abort();
    setContextItems([]);
    setUiMessages([]);
    setEvents([]);
    setError(null);
    setStreaming(false);
    streamingIdxRef.current = -1;
  }

  async function send(text: string) {
    if (!selected || streaming || !text.trim()) return;
    setError(null);

    const userItem = { role: 'user', content: text };
    const inputForRequest = [...contextItems, userItem];

    setContextItems(inputForRequest);
    setUiMessages((prev) => [...prev, { kind: 'user', text }]);
    setEvents([]);
    setStreaming(true);
    streamingIdxRef.current = -1;

    const controller = new AbortController();
    abortRef.current = controller;

    const req: ChatRequest = {
      scenarioId: selected.id,
      input: inputForRequest,
      enabledTools: Array.from(enabledTools),
      instructionsOverride:
        instructions !== selected.defaultInstructions ? instructions : undefined,
    };

    try {
      for await (const event of streamChat(req, controller.signal)) {
        setEvents((prev) => [...prev, event]);
        handleEvent(event);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setError(err?.message ?? String(err));
      }
    } finally {
      setStreaming(false);
    }
  }

  function handleEvent(event: ChatEvent) {
    switch (event.type) {
      case 'response.output_item.added': {
        const item = event.item;
        if (item?.type === 'message') {
          setUiMessages((prev) => {
            streamingIdxRef.current = prev.length;
            return [
              ...prev,
              { kind: 'assistant-text', text: '', streaming: true } as UIMessage,
            ];
          });
        } else if (item?.type === 'function_call') {
          setUiMessages((prev) => [
            ...prev,
            {
              kind: 'tool-call',
              callId: item.call_id ?? item.id ?? '',
              name: item.name,
              args: {},
              status: 'running',
            } as UIMessage,
          ]);
        }
        break;
      }

      case 'response.output_text.delta': {
        const delta = event.delta ?? '';
        const idx = streamingIdxRef.current;
        if (idx < 0) break;
        setUiMessages((prev) => {
          const next = prev.slice();
          const m = next[idx];
          if (m?.kind === 'assistant-text') {
            next[idx] = { ...m, text: m.text + delta };
          }
          return next;
        });
        break;
      }

      case 'response.output_text.done': {
        const idx = streamingIdxRef.current;
        if (idx < 0) break;
        setUiMessages((prev) => {
          const next = prev.slice();
          const m = next[idx];
          if (m?.kind === 'assistant-text') next[idx] = { ...m, streaming: false };
          return next;
        });
        streamingIdxRef.current = -1;
        break;
      }

      case 'response.function_call_arguments.done': {
        const parsed = safeParse(event.arguments);
        setUiMessages((prev) => {
          const next = prev.slice();
          for (let i = next.length - 1; i >= 0; i--) {
            const m = next[i];
            if (m.kind === 'tool-call' && m.status === 'running') {
              next[i] = { ...m, args: parsed };
              break;
            }
          }
          return next;
        });
        break;
      }

      case 'response.completed': {
        const out = event.response?.output ?? [];
        setContextItems((prev) => [...prev, ...out]);
        break;
      }

      case 'agent.tool_execution.completed': {
        const callId: string = event.call_id;
        setUiMessages((prev) => {
          const next = prev.slice();
          for (let i = next.length - 1; i >= 0; i--) {
            const m = next[i];
            if (m.kind === 'tool-call' && m.callId === callId) {
              next[i] = { ...m, output: event.output, status: 'done' };
              break;
            }
          }
          return next;
        });
        setContextItems((prev) => [
          ...prev,
          {
            type: 'function_call_output',
            call_id: callId,
            output:
              typeof event.output === 'string'
                ? event.output
                : JSON.stringify(event.output),
          },
        ]);
        break;
      }

      case 'agent.error': {
        setError(event.message ?? 'agent error');
        break;
      }
    }
  }

  function abort() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  return {
    scenarios,
    selected,
    instructions,
    setInstructions,
    enabledTools,
    toggleTool,
    uiMessages,
    events,
    streaming,
    error,
    send,
    abort,
    resetConversation,
    selectScenario,
  };
}

function safeParse(s: unknown): unknown {
  if (typeof s !== 'string') return s;
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
