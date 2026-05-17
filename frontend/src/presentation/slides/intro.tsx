/**
 * Intro slide. Sets the tone: this is about building a real mental model,
 * not memorising API surface area.
 */
import { Slide } from '../Slide';
import { Badge } from '../../design/Badge';
import { Kbd } from '../../design/Kbd';

export function Intro() {
  return (
    <Slide
      id="intro"
      section="intro"
      title="Building with AI, from first principles."
      subtitle="A 12-minute mental model so the rest of the workshop makes sense. We'll go LLM → agent → how to use & build with it."
    >
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <Badge tone="accent">Workshop</Badge>
        <span className="text-sm text-ink-soft">
          Use <Kbd>↓</Kbd> / <Kbd>↑</Kbd> or <Kbd>Space</Kbd> to navigate.
        </span>
      </div>
    </Slide>
  );
}
