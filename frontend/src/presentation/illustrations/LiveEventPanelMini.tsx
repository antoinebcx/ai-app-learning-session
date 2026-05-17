/**
 * LiveEventPanelMini — the "aha" demo of the deck.
 *
 * One click fires a real agent turn against the customer-support scenario
 * via /api/chat. The audience watches the SSE event stream unfold in real
 * time: response.created → output_item.added (function_call) →
 * agent.tool_execution.started/completed → response.completed → assistant
 * message. Concrete proof that the loop in the diagram above is actually
 * what's happening over the wire.
 */
import { useRef, useState } from 'react';
import { streamChat } from '../../lib/api';
import type { ChatEvent } from '../../types';
import { Button } from '../../design/Button';

const CANNED_PROMPT =
  'Please look up order ORD-1001 and tell me if I can get a refund.';

type AssistantMsg = { text: string; streaming: boolean };

export function LiveEventPanelMini() {
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [assistant, setAssistant] = useState<AssistantMsg | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function run() {
    if (running) return;
    setEvents([]);
    setAssistant(null);
    setError(null);
    setRunning(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for await (const ev of streamChat(
        {
          scenarioId: 'customer-support',
          input: [{ role: 'user', content: CANNED_PROMPT }],
        },
        controller.signal
      )) {
        setEvents((prev) => [...prev, ev]);
        if (ev.type === 'response.output_text.delta') {
          const delta = ev.delta ?? '';
          setAssistant((prev) =>
            prev
              ? { ...prev, text: prev.text + delta }
              : { text: delta, streaming: true }
          );
        } else if (ev.type === 'response.output_text.done') {
          setAssistant((prev) =>
            prev ? { ...prev, streaming: false } : prev
          );
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setError(err?.message ?? String(err));
      }
    } finally {
      setRunning(false);
    }
  }

  function stop() {
    abortRef.current?.abort();
    setRunning(false);
  }

  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-card">
      <div className="px-5 py-3 border-b border-line flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Canned prompt
          </div>
          <div className="text-sm text-ink font-mono truncate mt-0.5">
            {CANNED_PROMPT}
          </div>
        </div>
        {running ? (
          <Button size="sm" variant="secondary" onClick={stop}>
            Stop
          </Button>
        ) : (
          <Button size="sm" onClick={run}>
            Run live
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
        <div className="p-5 min-h-[280px]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Assistant reply
          </div>
          {!assistant && (
            <div className="text-xs text-ink-muted italic">
              Click "Run live" — the model will call <code className="font-mono">lookup_order</code>{' '}
              and <code className="font-mono">check_refund_eligibility</code>, then answer.
            </div>
          )}
          {assistant && (
            <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
              {assistant.text}
              {assistant.streaming && (
                <span className="inline-block w-1.5 h-4 align-text-bottom ml-0.5 bg-ink animate-pulse" />
              )}
            </div>
          )}
          {error && (
            <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
        </div>

        <div className="p-3 bg-surface-subtle min-h-[280px] max-h-[420px] overflow-y-auto">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted px-2 mb-1.5">
            Event stream ({events.length})
          </div>
          {events.length === 0 ? (
            <div className="text-xs text-ink-muted italic px-2">
              Events stream in here as the agent runs.
            </div>
          ) : (
            <ul className="space-y-0.5">
              {collapseDeltas(events).map((g, i) => (
                <EventRow key={i} type={g.type} count={g.count} family={g.family} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function EventRow({
  type,
  count,
  family,
}: {
  type: string;
  count: number;
  family: 'agent' | 'response' | 'error';
}) {
  const dot =
    family === 'agent' ? 'bg-accent' : family === 'error' ? 'bg-red-500' : 'bg-ink/40';
  return (
    <li className="flex items-center gap-2 px-2 py-1 rounded text-[11px] font-mono text-ink">
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
      <span className="truncate">{type}</span>
      {count > 1 && (
        <span className="ml-auto text-ink-muted tabular-nums">×{count}</span>
      )}
    </li>
  );
}

type GroupedEvent = { type: string; count: number; family: 'agent' | 'response' | 'error' };

function collapseDeltas(events: ChatEvent[]): GroupedEvent[] {
  const out: GroupedEvent[] = [];
  for (const e of events) {
    const family = familyOf(e.type);
    const last = out[out.length - 1];
    if (last && last.type === e.type && e.type.endsWith('.delta')) {
      last.count += 1;
    } else {
      out.push({ type: e.type, count: 1, family });
    }
  }
  return out;
}

function familyOf(type: string): 'agent' | 'response' | 'error' {
  if (type.startsWith('agent.error')) return 'error';
  if (type.startsWith('agent.')) return 'agent';
  return 'response';
}
