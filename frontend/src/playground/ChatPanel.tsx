/**
 * Center pane — the chat itself.
 * Renders the `uiMessages` view-model as user bubbles, assistant text,
 * and tool-call cards (with collapsible args + output). At the bottom:
 * a composer with the user's suggested prompts as quick-pick chips.
 */
import { useEffect, useRef, useState } from 'react';
import type { Scenario } from '../types';
import type { UIMessage } from './usePlayground';
import { Button } from '../design/Button';
import { TextArea } from '../design/TextArea';

type Props = {
  scenario: Scenario | null;
  messages: UIMessage[];
  streaming: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onAbort: () => void;
  onReset: () => void;
};

export function ChatPanel({
  scenario,
  messages,
  streaming,
  error,
  onSend,
  onAbort,
  onReset,
}: Props) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, streaming]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!draft.trim() || streaming) return;
    onSend(draft);
    setDraft('');
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-surface">
      <div className="px-6 py-3 border-b border-line flex items-center justify-between">
        <div className="text-sm">
          <span className="text-ink-muted">Chat with </span>
          <span className="font-medium text-ink">{scenario?.name ?? '…'}</span>
        </div>
        <button
          onClick={onReset}
          disabled={messages.length === 0 || streaming}
          className="text-xs text-ink-soft hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear conversation
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && scenario && (
            <Empty scenario={scenario} onPick={(p) => onSend(p)} />
          )}
          {messages.map((m, i) => (
            <MessageRow key={i} m={m} />
          ))}
          {streaming && messages[messages.length - 1]?.kind !== 'assistant-text' && (
            <div className="text-xs text-ink-muted italic">thinking…</div>
          )}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 text-red-900 text-sm p-3">
              {error}
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-line p-4 bg-surface"
      >
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <TextArea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            autoResize
            minRows={1}
            maxRows={6}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="flex-1"
          />
          {streaming ? (
            <Button type="button" variant="secondary" onClick={onAbort}>
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={!draft.trim()}>
              Send
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Empty({
  scenario,
  onPick,
}: {
  scenario: Scenario;
  onPick: (p: string) => void;
}) {
  return (
    <div className="text-center py-10">
      <div className="text-sm text-ink-muted">Try one of these to get started</div>
      <div className="mt-4 flex flex-col items-stretch gap-2">
        {scenario.suggestedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="text-left text-sm text-ink rounded-md border border-line bg-surface hover:border-ink/20 px-3 py-2 transition"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageRow({ m }: { m: UIMessage }) {
  if (m.kind === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-ink text-white px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap">
          {m.text}
        </div>
      </div>
    );
  }
  if (m.kind === 'assistant-text') {
    return (
      <div className="flex">
        <div className="max-w-[85%] text-sm leading-relaxed text-ink whitespace-pre-wrap">
          {m.text}
          {m.streaming && <Cursor />}
        </div>
      </div>
    );
  }
  return <ToolCallCard m={m} />;
}

function ToolCallCard({
  m,
}: {
  m: Extract<UIMessage, { kind: 'tool-call' }>;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg border border-line bg-surface-subtle">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
      >
        <ToolIcon />
        <span className="text-xs font-mono text-ink">{m.name}</span>
        <span
          className={[
            'text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded',
            m.status === 'running'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800',
          ].join(' ')}
        >
          {m.status}
        </span>
        <span className="ml-auto text-xs text-ink-muted">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 grid grid-cols-2 gap-3 text-[11px] font-mono">
          <div>
            <div className="text-ink-muted mb-1">arguments</div>
            <pre className="bg-surface rounded p-2 border border-line-subtle overflow-x-auto text-ink leading-snug">
              {JSON.stringify(m.args ?? {}, null, 2)}
            </pre>
          </div>
          <div>
            <div className="text-ink-muted mb-1">output</div>
            <pre className="bg-surface rounded p-2 border border-line-subtle overflow-x-auto text-ink leading-snug">
              {m.output !== undefined
                ? JSON.stringify(m.output, null, 2)
                : m.status === 'running'
                ? '…'
                : ''}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-3.5 h-3.5 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M10.5 2.5a3 3 0 0 1 3 3 3 3 0 0 1-3.5 2.95L4 14.5l-2.5-2.5 6.05-6a3 3 0 0 1 2.95-3.5Z" />
    </svg>
  );
}

function Cursor() {
  return (
    <span className="inline-block w-1.5 h-4 align-text-bottom ml-0.5 bg-ink animate-pulse" />
  );
}
