/**
 * §3.2 — Start simple, escalate.
 * The four patterns, in order of complexity. Don't reach for "agent" if a
 * one-shot prompt would do.
 */
import { Slide } from '../Slide';
import { PatternLadder } from '../illustrations/PatternLadder';

export function Slide_3_2() {
  return (
    <Slide
      id="3-2"
      section="3"
      sectionLabel="Build"
      number="3.2"
      title="Start simple, escalate."
      subtitle="There are four common patterns. Start at rung 1; only climb when you genuinely need what the next rung gives you."
    >
      <PatternLadder />
    </Slide>
  );
}
