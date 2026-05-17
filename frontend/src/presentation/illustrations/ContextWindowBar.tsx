/**
 * ContextWindowBar — visualises what fits in a model's context window.
 *
 * A logarithmic axis runs from a tweet (~50 tokens) to a long novel (~200k+).
 * The user toggles between window sizes (4K → 1M) and a vertical "cutoff"
 * line slides to that position. Reference items left of the line are green
 * (they fit); items right of the line are red (truncated).
 */
import { useState } from 'react';

type Item = { label: string; tokens: number };

const ITEMS: Item[] = [
  { label: 'A tweet', tokens: 50 },
  { label: 'A function', tokens: 300 },
  { label: 'A README', tokens: 800 },
  { label: 'A 10-page PDF', tokens: 5_000 },
  { label: 'A small codebase', tokens: 50_000 },
  { label: 'A 300-page novel', tokens: 200_000 },
];

const WINDOWS = [
  { label: '4K', value: 4_000 },
  { label: '32K', value: 32_000 },
  { label: '128K', value: 128_000 },
  { label: '1M', value: 1_000_000 },
];

const AXIS_TICKS = [100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000];
const MIN_LOG = Math.log10(AXIS_TICKS[0]);
const MAX_LOG = Math.log10(AXIS_TICKS[AXIS_TICKS.length - 1]);

function posPct(tokens: number) {
  return ((Math.log10(tokens) - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100;
}

export function ContextWindowBar() {
  const [windowIdx, setWindowIdx] = useState(2); // default to 128K
  const w = WINDOWS[windowIdx];
  const cutoff = posPct(w.value);

  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-card">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          Window size
        </div>
        <div className="inline-flex rounded-md border border-line bg-surface-subtle p-0.5">
          {WINDOWS.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => setWindowIdx(i)}
              className={[
                'px-3 py-1 text-xs font-mono rounded transition',
                i === windowIdx
                  ? 'bg-surface text-ink shadow-card'
                  : 'text-ink-muted hover:text-ink',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-12 mb-8 h-32">
        {/* axis line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-line" />

        {/* axis tick labels */}
        {AXIS_TICKS.map((t) => (
          <div
            key={t}
            className="absolute top-1/2 mt-2 -translate-x-1/2 text-[10px] font-mono text-ink-muted tabular-nums"
            style={{ left: `${posPct(t)}%` }}
          >
            {formatTokens(t)}
          </div>
        ))}
        {AXIS_TICKS.map((t) => (
          <div
            key={`tick-${t}`}
            className="absolute top-1/2 -translate-x-1/2 w-px h-2 bg-line"
            style={{ left: `${posPct(t)}%` }}
          />
        ))}

        {/* cutoff line */}
        <div
          className="absolute top-0 bottom-0 transition-[left] duration-700 ease-out"
          style={{ left: `${cutoff}%` }}
        >
          <div className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent whitespace-nowrap">
            ↓ window: {w.label}
          </div>
        </div>

        {/* shaded "fits" region */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 bg-accent-soft/70 rounded-l transition-[width] duration-700 ease-out"
          style={{ left: 0, width: `${cutoff}%` }}
        />

        {/* items above the axis */}
        {ITEMS.map((item) => {
          const x = posPct(item.tokens);
          const fits = item.tokens <= w.value;
          return (
            <div
              key={item.label}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${x}%`, top: 0 }}
            >
              <div className="text-[10px] text-ink-soft whitespace-nowrap text-center">
                {item.label}
              </div>
              <div className="text-[9px] font-mono text-ink-muted tabular-nums">
                {formatTokens(item.tokens)}
              </div>
              <div
                className={`mt-1 w-2.5 h-2.5 rounded-full border ${
                  fits
                    ? 'bg-accent border-accent'
                    : 'bg-surface border-red-400'
                }`}
              />
            </div>
          );
        })}
      </div>

      <p className="text-sm text-ink-soft leading-relaxed">
        Everything left of the line fits in the model's working memory. Anything
        to the right doesn't — you either truncate, summarise, or fetch on demand.
      </p>
    </div>
  );
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return `${n}`;
}
