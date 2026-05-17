/**
 * WhatIsAnLLM — a three-stage diagram positioning an LLM within machine
 * learning: a corpus of text → training → a frozen set of weights you run
 * at inference time. Tiny, on purpose. The whole slide is meant to take 30
 * seconds and bridge into the rest of §1.
 */
export function WhatIsAnLLM() {
  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-card">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-4 sm:gap-3">
        <Stage
          step="01"
          title="A corpus"
          body="Trillions of words: web pages, books, code."
        />
        <Arrow />
        <Stage
          step="02"
          title="Training"
          body="A neural network learns to predict the next token, again and again."
        />
        <Arrow />
        <Stage
          step="03"
          title="Frozen model"
          body="The result: a fixed set of weights. Every API call you make runs this."
          highlighted
        />
      </div>
    </div>
  );
}

function Stage({
  step,
  title,
  body,
  highlighted = false,
}: {
  step: string;
  title: string;
  body: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-lg border p-4 flex flex-col gap-2 transition',
        highlighted
          ? 'border-accent/30 bg-accent-soft/40'
          : 'border-line bg-surface-subtle',
      ].join(' ')}
    >
      <div
        className={`text-[10px] font-mono tabular-nums ${
          highlighted ? 'text-accent' : 'text-ink-muted'
        }`}
      >
        {step}
      </div>
      <div className="text-sm font-semibold text-ink">{title}</div>
      <div className="text-xs text-ink-soft leading-relaxed">{body}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden sm:flex items-center justify-center text-ink-muted">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path
          d="M1 6 H17 M13 2 L17 6 L13 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
