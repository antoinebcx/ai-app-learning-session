/**
 * GroundedVsNot — side-by-side comparison.
 *
 * Same user question, asked two ways: bare model vs model + web_search.
 * The "bare" card is confidently wrong; the "grounded" card is cited.
 * Content is hard-coded — this is a pedagogical prop, not a live demo.
 */

const QUESTION = 'When did the Eurostar terminal at Lille-Europe station open?';

const BARE_ANSWER =
  'The Eurostar terminal at Lille-Europe opened in 1993, alongside the launch of Eurostar services through the Channel Tunnel.';

const GROUNDED_ANSWER =
  'Lille-Europe station opened on 29 May 1994; commercial Eurostar service began on 14 November 1994.';

export function GroundedVsNot() {
  return (
    <div className="space-y-4">
      <Question text={QUESTION} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnswerCard
          variant="bare"
          tagline="Model alone"
          answer={BARE_ANSWER}
          verdict={{ ok: false, label: 'Confidently wrong' }}
          subtext="No way to verify; the model produces plausible-sounding text."
        />
        <AnswerCard
          variant="grounded"
          tagline="Model + web_search"
          answer={GROUNDED_ANSWER}
          verdict={{ ok: true, label: 'Correct, cited' }}
          subtext="The model called web_search, read the result, and grounded its answer."
          source={{ label: 'wikipedia.org', href: 'https://en.wikipedia.org/wiki/Gare_de_Lille-Europe' }}
        />
      </div>
    </div>
  );
}

function Question({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-subtle px-4 py-3 flex items-start gap-3">
      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted mt-1">
        User
      </span>
      <span className="text-sm text-ink leading-relaxed">{text}</span>
    </div>
  );
}

function AnswerCard({
  variant,
  tagline,
  answer,
  verdict,
  subtext,
  source,
}: {
  variant: 'bare' | 'grounded';
  tagline: string;
  answer: string;
  verdict: { ok: boolean; label: string };
  subtext: string;
  source?: { label: string; href: string };
}) {
  const ringColor =
    variant === 'grounded'
      ? 'border-accent/30 bg-accent-soft/40'
      : 'border-red-200 bg-red-50/40';
  return (
    <div className={`rounded-xl border ${ringColor} p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-soft">
          {tagline}
        </span>
        <VerdictPill ok={verdict.ok} label={verdict.label} />
      </div>
      <div className="text-sm text-ink leading-relaxed">{answer}</div>
      {source && (
        <a
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline inline-flex items-center gap-1"
        >
          source: {source.label} <span aria-hidden>↗</span>
        </a>
      )}
      <div className="text-xs text-ink-muted leading-relaxed pt-2 border-t border-line-subtle">
        {subtext}
      </div>
    </div>
  );
}

function VerdictPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium',
        ok
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-red-100 text-red-800',
      ].join(' ')}
    >
      <span aria-hidden>{ok ? '✓' : '✗'}</span> {label}
    </span>
  );
}
