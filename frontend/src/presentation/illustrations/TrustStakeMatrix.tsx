/**
 * TrustStakeMatrix — 2×2 to help engineers decide *when* to lean on AI.
 *
 * Axes:
 *   x → stakes of getting it wrong (low → high)
 *   y → typical AI accuracy on that kind of task (low → high)
 *
 * Each quadrant is tinted and labelled; sample dev tasks are pinned inside.
 * Used at §3.1 to give the audience a practical mental rule.
 */
type TaskDot = { label: string; x: number; y: number };

const TASKS: TaskDot[] = [
  // top-left (high accuracy, low stakes) — go for it
  { label: 'Boilerplate', x: 18, y: 88 },
  { label: 'Test scaffolding', x: 38, y: 78 },
  { label: 'Code explanation', x: 12, y: 62 },
  // bottom-left (lower accuracy, low stakes) — try it
  { label: 'Brainstorming', x: 22, y: 32 },
  // top-right (high accuracy, high stakes) — use with review
  { label: 'Refactor with tests', x: 62, y: 75 },
  // bottom-right (lower accuracy, high stakes) — avoid
  { label: 'Architecture decisions', x: 62, y: 38 },
  { label: 'Production migration', x: 75, y: 22 },
  { label: 'Security-critical code', x: 92, y: 12 },
];

export function TrustStakeMatrix() {
  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-card">
      <div className="grid grid-cols-[120px_1fr] gap-4">
        {/* Y-axis label */}
        <div className="flex items-center justify-center">
          <div className="-rotate-90 text-[10px] font-semibold uppercase tracking-wider text-ink-muted whitespace-nowrap">
            AI accuracy →
          </div>
        </div>

        {/* The matrix */}
        <div className="relative aspect-[16/10] rounded-md overflow-hidden border border-line-subtle">
          {/* Quadrant tints */}
          <Quadrant x="0%" y="0%" w="50%" h="50%" tone="green" label="Go for it" sub="lean in" />
          <Quadrant x="50%" y="0%" w="50%" h="50%" tone="amber" label="Use with review" sub="ship behind tests" />
          <Quadrant x="0%" y="50%" w="50%" h="50%" tone="neutral" label="Try it" sub="low cost of being wrong" />
          <Quadrant x="50%" y="50%" w="50%" h="50%" tone="red" label="Avoid" sub="or invest in guardrails" />

          {/* Center cross */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-line" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-line" />

          {/* Task dots */}
          {TASKS.map((t) => (
            <Dot key={t.label} label={t.label} x={t.x} y={t.y} />
          ))}
        </div>

        <div />
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted text-center">
          Stakes of getting it wrong →
        </div>
      </div>
    </div>
  );
}

function Quadrant({
  x,
  y,
  w,
  h,
  tone,
  label,
  sub,
}: {
  x: string;
  y: string;
  w: string;
  h: string;
  tone: 'green' | 'amber' | 'neutral' | 'red';
  label: string;
  sub: string;
}) {
  const fills: Record<string, string> = {
    green: 'bg-emerald-50/70',
    amber: 'bg-amber-50/60',
    red: 'bg-red-50/60',
    neutral: 'bg-line-subtle/60',
  };
  const text: Record<string, string> = {
    green: 'text-emerald-800',
    amber: 'text-amber-800',
    red: 'text-red-800',
    neutral: 'text-ink-soft',
  };
  return (
    <div
      className={`absolute ${fills[tone]} p-2`}
      style={{ left: x, top: y, width: w, height: h }}
    >
      <div className={`text-xs font-semibold ${text[tone]}`}>{label}</div>
      <div className={`text-[10px] ${text[tone]} opacity-80`}>{sub}</div>
    </div>
  );
}

function Dot({ label, x, y }: { label: string; x: number; y: number }) {
  // y is "AI accuracy → up", so invert for CSS (top=0)
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      style={{ left: `${x}%`, top: `${100 - y}%` }}
    >
      <span className="w-2 h-2 rounded-full bg-ink ring-2 ring-white" />
      <span className="text-[10px] font-medium text-ink bg-white/80 backdrop-blur-sm px-1 rounded whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
