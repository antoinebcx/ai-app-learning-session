/**
 * PatternLadder — the four common patterns for building with LLMs, ordered
 * by complexity. Start at rung 1; only climb when the simpler pattern
 * stops carrying you.
 */
type Rung = {
  name: string;
  whenToUse: string;
  example: string;
};

const RUNGS: Rung[] = [
  {
    name: 'Single completion',
    whenToUse: 'You need text back. One question, one answer.',
    example: 'Generate a commit message from a diff.',
  },
  {
    name: 'Structured output',
    whenToUse: 'You need machine-readable data, not prose.',
    example: 'Extract { name, age } from a free-text bio.',
  },
  {
    name: 'Function calling',
    whenToUse: 'The model needs to read or act on your systems.',
    example: 'Pull a user record before answering.',
  },
  {
    name: 'Agent loop',
    whenToUse: 'Actions feed back into the next decision.',
    example: 'Triage → look up → check policy → refund.',
  },
];

export function PatternLadder() {
  return (
    <div className="relative pl-12 sm:pl-16">
      {/* Vertical rail */}
      <div className="absolute left-5 sm:left-7 top-3 bottom-3 w-0.5 bg-gradient-to-b from-accent via-amber-400 to-red-400 rounded-full" />

      <ol className="space-y-3">
        {RUNGS.map((r, i) => (
          <li
            key={r.name}
            className="relative rounded-xl border border-line bg-surface p-5 shadow-card"
          >
            {/* Step circle */}
            <span
              className="absolute -left-12 sm:-left-16 top-5 w-10 h-10 rounded-full bg-surface border-2 flex items-center justify-center font-mono text-sm font-semibold"
              style={{
                borderColor: rungColor(i),
                color: rungColor(i),
              }}
            >
              {i + 1}
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <div className="text-base font-semibold text-ink">{r.name}</div>
              <div className="text-[11px] uppercase tracking-wider text-ink-muted">
                rung {i + 1}/4
              </div>
            </div>
            <div className="mt-2 text-sm text-ink-soft leading-relaxed">
              <span className="text-ink font-medium">Use when:</span> {r.whenToUse}
            </div>
            <div className="mt-1 text-xs text-ink-muted italic">
              e.g. {r.example}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm text-ink-soft max-w-3xl">
        Each rung costs more (latency, cost, complexity) than the one below. If
        rung 1 is enough — don't climb.
      </p>
    </div>
  );
}

function rungColor(i: number): string {
  return ['#10A37F', '#10A37F', '#D97706', '#D97706'][i] ?? '#10A37F';
}
