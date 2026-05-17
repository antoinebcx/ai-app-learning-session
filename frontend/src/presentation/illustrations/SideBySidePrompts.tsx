/**
 * SideBySidePrompts — live demo of "prompts are code".
 *
 * Same user question, two different system prompts, streamed in parallel
 * via /api/chat. The audience watches how the same model produces noticeably
 * different shapes of answer just from the system message change.
 */
import { useRef, useState } from 'react';
import { streamChat } from '../../lib/api';
import { Button } from '../../design/Button';
import { TextArea } from '../../design/TextArea';

const DEFAULT_QUESTION = 'Why is JavaScript single-threaded?';
const PROMPT_A =
  'You are a friendly tutor. Explain concepts thoroughly with at least one analogy and one concrete example. Use short paragraphs.';
const PROMPT_B =
  'You are a senior engineer. Give the shortest correct answer. No analogies, no preamble. 3 sentences max.';

type ColState = {
  text: string;
  streaming: boolean;
  error?: string | null;
};

const EMPTY: ColState = { text: '', streaming: false, error: null };

export function SideBySidePrompts() {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [a, setA] = useState<ColState>(EMPTY);
  const [b, setB] = useState<ColState>(EMPTY);
  const [running, setRunning] = useState(false);
  const abortRefs = useRef<{ a?: AbortController; b?: AbortController }>({});

  async function streamInto(
    instructions: string,
    setState: (fn: (s: ColState) => ColState) => void,
    which: 'a' | 'b'
  ) {
    const ctrl = new AbortController();
    abortRefs.current[which] = ctrl;
    setState(() => ({ text: '', streaming: true, error: null }));
    try {
      for await (const ev of streamChat(
        {
          scenarioId: 'customer-support',
          input: [{ role: 'user', content: question }],
          enabledTools: [],
          instructionsOverride: instructions,
        },
        ctrl.signal
      )) {
        if (ev.type === 'response.output_text.delta') {
          const delta = ev.delta ?? '';
          setState((s) => ({ ...s, text: s.text + delta }));
        } else if (ev.type === 'response.output_text.done') {
          setState((s) => ({ ...s, streaming: false }));
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setState((s) => ({ ...s, streaming: false, error: err?.message ?? String(err) }));
      }
    } finally {
      setState((s) => ({ ...s, streaming: false }));
    }
  }

  async function runBoth() {
    if (running || !question.trim()) return;
    setRunning(true);
    await Promise.all([
      streamInto(PROMPT_A, setA, 'a'),
      streamInto(PROMPT_B, setB, 'b'),
    ]);
    setRunning(false);
  }

  function stop() {
    abortRefs.current.a?.abort();
    abortRefs.current.b?.abort();
    setRunning(false);
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-end gap-3 mb-4">
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-1">
            User question
          </div>
          <TextArea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            minRows={1}
            autoResize
            maxRows={3}
            className="text-sm"
          />
        </div>
        {running ? (
          <Button variant="secondary" onClick={stop}>Stop</Button>
        ) : (
          <Button onClick={runBoth} disabled={!question.trim()}>Run both</Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PromptColumn label="System prompt A" system={PROMPT_A} state={a} />
        <PromptColumn label="System prompt B" system={PROMPT_B} state={b} />
      </div>
    </div>
  );
}

function PromptColumn({
  label,
  system,
  state,
}: {
  label: string;
  system: string;
  state: ColState;
}) {
  return (
    <div className="rounded-lg border border-line overflow-hidden">
      <div className="px-3 py-2 bg-surface-subtle border-b border-line">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          {label}
        </div>
        <div className="text-xs text-ink-soft mt-0.5 leading-relaxed line-clamp-2">
          {system}
        </div>
      </div>
      <div className="p-3 min-h-[180px] text-sm text-ink leading-relaxed whitespace-pre-wrap">
        {state.text}
        {state.streaming && (
          <span className="inline-block w-1.5 h-4 align-text-bottom ml-0.5 bg-ink animate-pulse" />
        )}
        {!state.text && !state.streaming && (
          <span className="text-xs text-ink-muted italic">— click "Run both" —</span>
        )}
        {state.error && (
          <div className="mt-2 text-xs text-red-700">{state.error}</div>
        )}
      </div>
    </div>
  );
}
