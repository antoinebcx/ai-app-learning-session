/**
 * Tiny Server-Sent Events reader for `fetch`-style streams.
 * Yields one parsed JSON event per SSE `data:` line. The browser's native
 * EventSource API only supports GET requests, so we read the body ourselves.
 */

export async function* readSse<T = unknown>(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<T> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE separates events with a blank line (\n\n).
    let separatorIndex: number;
    while ((separatorIndex = buffer.indexOf('\n\n')) !== -1) {
      const rawEvent = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);

      for (const line of rawEvent.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6);
        try {
          yield JSON.parse(json) as T;
        } catch {
          // ignore malformed chunks
        }
      }
    }
  }
}
