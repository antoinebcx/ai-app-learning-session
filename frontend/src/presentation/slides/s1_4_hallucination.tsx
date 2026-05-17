/**
 * §1.4 — Hallucination.
 * Fluency ≠ truth. There's no built-in "I don't know"; the model produces
 * plausible text whether it has the answer or not. Bridge to §2: tools.
 */
import { Slide } from '../Slide';
import { GroundedVsNot } from '../illustrations/GroundedVsNot';

export function Slide_1_4() {
  return (
    <Slide
      id="1-4"
      section="1"
      sectionLabel="LLM"
      number="1.4"
      title="Hallucination is the default failure mode."
      subtitle="There is no built-in &quot;I don't know.&quot; The model produces the most plausible next tokens — whether they happen to be true or not."
    >
      <GroundedVsNot />
      <p className="mt-6 text-sm text-ink-soft max-w-3xl">
        Better prompting nudges the rate down, but the cure is{' '}
        <strong className="text-ink">grounding</strong> — giving the model real
        data via tools. Which is exactly the bridge to the next section.
      </p>
    </Slide>
  );
}
