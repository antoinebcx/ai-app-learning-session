/**
 * Landing page. The session opens here: short intro, then two big cards
 * pointing at the Presentation deck and the Playground.
 */
import { Card } from '../design/Card';
import { Badge } from '../design/Badge';

type Props = { navigate: (to: string) => void };

export function HomePage({ navigate }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Badge tone="accent" className="mb-6">Learning session</Badge>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
        Building with AI, from first principles.
      </h1>
      <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-2xl">
        A 90-minute workshop in two parts: a short presentation that builds a
        mental model of LLMs and agents, then a working playground we extend
        together — picking a use case and wiring up tools live.
      </p>

      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        <NavCard
          eyebrow="Part 1"
          title="Presentation"
          body="LLM → Agent → Use it & build with it. About 10–15 minutes."
          cta="Open the deck"
          onClick={() => navigate('/presentation')}
        />
        <NavCard
          eyebrow="Part 2"
          title="Playground"
          body="Two preset scenarios, editable system prompt, live event panel."
          cta="Open the playground"
          onClick={() => navigate('/playground')}
        />
      </div>
    </div>
  );
}

function NavCard({
  eyebrow,
  title,
  body,
  cta,
  onClick,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-lg"
    >
      <Card className="h-full transition group-hover:border-ink/20">
        <div className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          {eyebrow}
        </div>
        <div className="mt-2 text-xl font-semibold text-ink">{title}</div>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
        <div className="mt-6 text-sm font-medium text-accent inline-flex items-center gap-1">
          {cta} <span aria-hidden>→</span>
        </div>
      </Card>
    </button>
  );
}
