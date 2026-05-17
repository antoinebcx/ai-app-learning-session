/**
 * Scenario registry.
 * Imports every concrete scenario and exposes:
 *   - `scenarios`     — lookup by id, used by the chat route to dispatch handlers
 *   - `listScenarios` — public view (without handlers) returned to the frontend
 * Add a new scenario by importing it and dropping it into the `all` array.
 */
import type { Scenario } from './types.js';
import { customerSupport } from './customer-support.js';
import { webResearch } from './web-research.js';

const all: Scenario[] = [customerSupport, webResearch];

export const scenarios: Record<string, Scenario> = Object.fromEntries(
  all.map((s) => [s.id, s])
);

export function listScenarios() {
  return all.map(({ handlers, ...publicFields }) => publicFields);
}
