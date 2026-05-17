/**
 * "Web research" demo scenario.
 * Demonstrates two things the customer-support scenario can't:
 *   - a built-in OpenAI tool (web_search) that OpenAI runs for us, and
 *   - a custom function tool used as a structured-output sink (summarize_findings).
 * The summarize handler just echoes its args — the *call itself* is the artifact.
 */
import type { Scenario } from './types.js';

export const webResearch: Scenario = {
  id: 'web-research',
  name: 'Web research assistant',
  tagline: 'Uses the built-in web_search tool to gather sources, then emits a structured summary.',
  defaultInstructions: `You are a careful web research assistant.

When given a topic or question:
1. Use web_search to gather information from reputable sources.
2. Cross-reference at least two sources for any non-trivial claim.
3. When you have enough material, call summarize_findings with a structured report.
4. Keep prose concise. Always cite sources.`,
  suggestedPrompts: [
    'What did OpenAI announce at their most recent DevDay?',
    'Summarize the current state of the EU AI Act for builders.',
    'Compare the latest Anthropic and OpenAI flagship models.',
  ],
  tools: [
    { type: 'web_search' },
    {
      type: 'function',
      name: 'summarize_findings',
      description: 'Emit a structured summary of research findings. Call this once you have enough material from web_search.',
      parameters: {
        type: 'object',
        properties: {
          headline: { type: 'string', description: 'One-sentence summary of the finding.' },
          key_points: {
            type: 'array',
            items: { type: 'string' },
            description: 'Three to seven concise bullet points.',
          },
          sources: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                url: { type: 'string' },
              },
              required: ['title', 'url'],
              additionalProperties: false,
            },
          },
        },
        required: ['headline', 'key_points', 'sources'],
        additionalProperties: false,
      },
      strict: true,
    },
  ],
  handlers: {
    summarize_findings: (args) => {
      return { acknowledged: true, summary: args };
    },
  },
};
