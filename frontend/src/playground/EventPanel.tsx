/**
 * Right pane — live SSE event stream.
 *
 * This is the teaching weapon: it makes the agent loop visible. Every
 * Server-Sent Event the backend forwards (raw OpenAI `response.*` events plus
 * our custom `agent.*` events) shows up here in order. Rows are color-coded
 * by family and clickable to inspect the raw JSON payload.
 *
 * Bursts of identical-type events (e.g. dozens of `response.output_text.delta`)
 * are collapsed into a single grouped row to keep the panel readable.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChatEvent } from '../types';

type Props = { events: ChatEvent[] };

export function EventPanel({ events }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const groups = useMemo(() => groupEvents(events), [events]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [events.length]);

  return (
    <aside className="w-[400px] shrink-0 border-l border-line bg-surface-subtle flex flex-col">
      <div className="px-4 py-3 border-b border-line">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          Event stream
        </div>
        <div className="text-xs text-ink-soft mt-0.5">
          Every SSE event the agent emitted this turn.
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1">
        {groups.length === 0 && (
          <div className="text-xs text-ink-muted italic py-6 text-center">
            Send a message to see events stream in.
          </div>
        )}
        {groups.map((g, i) => (
          <EventGroupRow key={i} group={g} />
        ))}
      </div>
    </aside>
  );
}

type EventGroup = { type: string; events: ChatEvent[]; family: Family };
type Family = 'agent' | 'response' | 'error' | 'other';

function groupEvents(events: ChatEvent[]): EventGroup[] {
  const out: EventGroup[] = [];
  for (const e of events) {
    const last = out[out.length - 1];
    if (last && last.type === e.type && isGroupable(e.type)) {
      last.events.push(e);
    } else {
      out.push({ type: e.type, events: [e], family: familyOf(e.type) });
    }
  }
  return out;
}

function isGroupable(type: string): boolean {
  return type.endsWith('.delta');
}

function familyOf(type: string): Family {
  if (type.startsWith('agent.error')) return 'error';
  if (type.startsWith('agent.')) return 'agent';
  if (type.startsWith('response.')) return 'response';
  return 'other';
}

function EventGroupRow({ group }: { group: EventGroup }) {
  const [open, setOpen] = useState(false);
  const multiple = group.events.length > 1;
  return (
    <div className="rounded-md border border-line bg-surface">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left"
      >
        <FamilyDot family={group.family} />
        <span className="text-[12px] font-mono text-ink truncate">{group.type}</span>
        {multiple && (
          <span className="ml-auto text-[10px] text-ink-muted tabular-nums">
            ×{group.events.length}
          </span>
        )}
        {!multiple && (
          <span className="ml-auto text-[10px] text-ink-muted">{open ? '−' : '+'}</span>
        )}
      </button>
      {open && (
        <div className="px-2.5 pb-2.5 space-y-2 max-h-80 overflow-y-auto">
          {group.events.map((e, i) => (
            <pre
              key={i}
              className="text-[10px] leading-snug bg-surface-subtle rounded p-2 border border-line-subtle font-mono text-ink-soft whitespace-pre-wrap break-all"
            >
              {JSON.stringify(stripNoise(e), null, 2)}
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}

function FamilyDot({ family }: { family: Family }) {
  const colors: Record<Family, string> = {
    agent: 'bg-accent',
    response: 'bg-ink/40',
    error: 'bg-red-500',
    other: 'bg-ink/20',
  };
  return <span className={`w-1.5 h-1.5 rounded-full ${colors[family]} shrink-0`} />;
}

/** Drop reasoning.encrypted_content from previews — it's a giant opaque blob. */
function stripNoise(e: ChatEvent): unknown {
  const clone: any = JSON.parse(JSON.stringify(e));
  walk(clone);
  return clone;
}

function walk(obj: any) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach(walk);
    return;
  }
  if (typeof obj.encrypted_content === 'string') {
    obj.encrypted_content = `<${obj.encrypted_content.length} chars>`;
  }
  for (const k of Object.keys(obj)) walk(obj[k]);
}
