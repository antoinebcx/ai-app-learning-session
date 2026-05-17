/**
 * PrinciplesGrid — the closing summary card grid. Seven principles every
 * builder should leave the room with. Each card is intentionally short —
 * meant to be re-read after the session, not memorised during it.
 */
type Principle = {
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    title: 'Prompts are code',
    body: 'Version them, test them, iterate. Don\'t bury them in a string you change ad hoc.',
  },
  {
    title: 'Start simple, escalate',
    body: 'Single completion → structured output → function calling → agent loop. In that order.',
  },
  {
    title: 'Eval before optimise',
    body: 'A tiny test set you can re-run after every change beats "it felt better".',
  },
  {
    title: 'Structured outputs > parsing text',
    body: 'If you need data, ask for JSON. Stop regex-ing free text.',
  },
  {
    title: 'Stream for UX, sandbox for safety',
    body: 'Tokens to the user as they arrive. Tool execution server-side, with audit.',
  },
  {
    title: 'Cost & latency are product decisions',
    body: 'Pick the model for the job. gpt-5 isn\'t always the right answer.',
  },
  {
    title: 'Observe everything',
    body: 'Log inputs, outputs, tool calls. You will need them when behaviour drifts.',
  },
];

export function PrinciplesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {PRINCIPLES.map((p, i) => (
        <PrincipleCard key={p.title} index={i + 1} {...p} />
      ))}
    </div>
  );
}

function PrincipleCard({
  index,
  title,
  body,
}: Principle & { index: number }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4 hover:border-accent/40 transition">
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-mono text-accent tabular-nums">
          {String(index).padStart(2, '0')}
        </span>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
