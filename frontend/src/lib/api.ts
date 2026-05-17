/**
 * Thin HTTP client for the backend.
 * `fetchScenarios` is a simple GET. `streamChat` opens a POST and yields each
 * SSE event from /api/chat — the agent loop's lifeblood. Callers iterate it
 * with `for await (const ev of streamChat(...))`.
 */
import type { ChatEvent, ChatRequest, Scenario } from '../types';
import { readSse } from './sse';

export async function fetchScenarios(): Promise<Scenario[]> {
  const res = await fetch('/api/scenarios');
  if (!res.ok) throw new Error(`fetchScenarios failed: ${res.status}`);
  return res.json();
}

export async function* streamChat(
  req: ChatRequest,
  signal?: AbortSignal
): AsyncGenerator<ChatEvent> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`streamChat failed: ${res.status}`);
  }
  for await (const ev of readSse<ChatEvent>(res.body)) {
    yield ev;
  }
}
