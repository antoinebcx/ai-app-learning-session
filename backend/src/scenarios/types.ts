/**
 * Shared types for "scenarios" — the preset agent configurations the user can
 * pick from in the playground. A Scenario bundles:
 *   - a system prompt (defaultInstructions),
 *   - a list of tool definitions in the shape the Responses API expects,
 *   - and handlers that actually execute the function tools server-side.
 */

export type FunctionToolDef = {
  type: 'function';
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  strict?: boolean;
};

export type BuiltInToolDef = {
  type: 'web_search' | 'file_search' | 'code_interpreter';
};

export type ToolDef = FunctionToolDef | BuiltInToolDef;

export type ToolHandler = (args: Record<string, unknown>) => Promise<unknown> | unknown;

export type Scenario = {
  id: string;
  name: string;
  tagline: string;
  defaultInstructions: string;
  suggestedPrompts: string[];
  tools: ToolDef[];
  handlers: Record<string, ToolHandler>;
};
