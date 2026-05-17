/**
 * §3.3 — The seven things that matter most.
 * Closing card grid plus one final live demo: same question, two system
 * prompts. The takeaway slide.
 */
import { Slide } from '../Slide';
import { PrinciplesGrid } from '../illustrations/PrinciplesGrid';
import { SideBySidePrompts } from '../illustrations/SideBySidePrompts';

export function Slide_3_3() {
  return (
    <Slide
      id="3-3"
      section="3"
      sectionLabel="Build"
      number="3.3"
      title="The seven things that matter most."
      subtitle="A small set of habits that compound. Read them once, then re-read whenever you're building something new."
    >
      <PrinciplesGrid />
      <div className="mt-8">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-2">
          One live demo for "prompts are code"
        </div>
        <SideBySidePrompts />
      </div>
    </Slide>
  );
}
