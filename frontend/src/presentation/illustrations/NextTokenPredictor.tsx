/**
 * NextTokenPredictor — animated illustration of "the model is a next-token
 * predictor". A small canned sequence plays in a loop: the prompt grows by
 * one token at a time; under it, the top-5 candidate tokens animate in with
 * probability bars and the chosen one is highlighted.
 *
 * Numbers are illustrative, not real model output — predictability matters
 * more than authenticity for a presentation prop.
 */
import { useEffect, useState } from 'react';

type Candidate = { token: string; p: number };
type Step = { prompt: string; candidates: Candidate[] };

const SEQUENCE: Step[] = [
  {
    prompt: 'The capital of France is',
    candidates: [
      { token: ' Paris', p: 0.94 },
      { token: ' a', p: 0.02 },
      { token: ' the', p: 0.015 },
      { token: ' Lyon', p: 0.013 },
      { token: ' Marseille', p: 0.012 },
    ],
  },
  {
    prompt: 'The capital of France is Paris',
    candidates: [
      { token: '.', p: 0.55 },
      { token: ',', p: 0.25 },
      { token: ' and', p: 0.10 },
      { token: ' —', p: 0.06 },
      { token: ' (', p: 0.04 },
    ],
  },
  {
    prompt: 'The capital of France is Paris.',
    candidates: [
      { token: ' It', p: 0.45 },
      { token: ' The', p: 0.18 },
      { token: ' Paris', p: 0.12 },
      { token: ' France', p: 0.12 },
      { token: ' Located', p: 0.13 },
    ],
  },
  {
    prompt: 'The capital of France is Paris. It',
    candidates: [
      { token: ' is', p: 0.55 },
      { token: ' has', p: 0.22 },
      { token: ' sits', p: 0.10 },
      { token: ' lies', p: 0.08 },
      { token: ' was', p: 0.05 },
    ],
  },
  {
    prompt: 'The capital of France is Paris. It is',
    candidates: [
      { token: ' located', p: 0.30 },
      { token: ' a', p: 0.28 },
      { token: ' the', p: 0.20 },
      { token: ' home', p: 0.12 },
      { token: ' famous', p: 0.10 },
    ],
  },
];

const STEP_MS = 1800;

export function NextTokenPredictor() {
  const [step, setStep] = useState(0);
  const data = SEQUENCE[step % SEQUENCE.length];
  const picked = data.candidates[0];

  useEffect(() => {
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-card">
      <Label>Prompt</Label>
      <div className="mt-2 font-mono text-base sm:text-lg leading-relaxed text-ink min-h-[3.5rem]">
        {data.prompt}
        <span
          key={step}
          className="ml-1 inline-block px-1 rounded bg-accent-soft text-accent animate-[fadeIn_500ms_ease-out]"
        >
          {picked.token}
        </span>
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <Label>Next-token candidates</Label>
        <span className="text-[11px] font-mono text-ink-muted">
          sampling: top-1
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        {data.candidates.map((c, i) => (
          <CandidateBar
            key={`${step}-${i}`}
            token={c.token}
            probability={c.p}
            picked={i === 0}
          />
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function CandidateBar({
  token,
  probability,
  picked,
}: {
  token: string;
  probability: number;
  picked: boolean;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(probability * 100));
    return () => cancelAnimationFrame(id);
  }, [probability]);

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 sm:w-36 font-mono text-sm text-ink truncate">{token}</div>
      <div className="flex-1 h-2 bg-line-subtle rounded overflow-hidden">
        <div
          className={`h-full rounded transition-[width] duration-700 ease-out ${
            picked ? 'bg-accent' : 'bg-ink-muted/40'
          }`}
          style={{ width: `${w}%` }}
        />
      </div>
      <div className="w-12 text-right font-mono text-xs text-ink-muted tabular-nums">
        {(probability * 100).toFixed(1)}%
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
      {children}
    </div>
  );
}
