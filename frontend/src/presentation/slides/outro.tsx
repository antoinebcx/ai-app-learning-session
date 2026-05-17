/**
 * Outro slide. Hands off from the talk to the playground.
 */
import { Slide } from '../Slide';

export function Outro() {
  return (
    <Slide
      id="outro"
      section="outro"
      title="Now let’s build."
      subtitle="Open the playground, pick a scenario, and let's wire up some tools together. Bring use-cases — we'll prototype them live."
    >
      <a
        href="/playground"
        className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-accent text-white font-medium hover:bg-accent/90 transition"
      >
        Open the playground <span aria-hidden>→</span>
      </a>
    </Slide>
  );
}
