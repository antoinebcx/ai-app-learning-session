/**
 * Frontend mirror of the public scenario types defined on the backend
 * (see backend/src/scenarios/types.ts). We duplicate them rather than
 * pull in a shared package because the project is tiny and the types are stable.
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

export type Scenario = {
  id: string;
  name: string;
  tagline: string;
  defaultInstructions: string;
  suggestedPrompts: string[];
  tools: ToolDef[];
};

export type ChatRequest = {
  scenarioId: string;
  input: any[];
  enabledTools?: string[];
  instructionsOverride?: string;
  model?: string;
};

/** A single SSE event arriving from /api/chat. The `type` field disambiguates. */
export type ChatEvent = { type: string; [k: string]: any };
