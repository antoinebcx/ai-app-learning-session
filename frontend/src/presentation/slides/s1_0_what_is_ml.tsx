/**
 * §1.0 — What's an LLM, really?
 * Quick orientation for anyone who hasn't worked with machine learning
 * before: an LLM is software whose behaviour was *learned* from data, not
 * written by hand. Then training stops and the model becomes a fixed thing
 * you run inference on. The rest of §1 picks up from there.
 */
import { Slide } from '../Slide';
import { WhatIsAnLLM } from '../illustrations/WhatIsAnLLM';

export function Slide_1_0() {
  return (
    <Slide
      id="1-0"
      section="1"
      sectionLabel="LLM"
      number="1.0"
      title="What's an LLM, really?"
      subtitle="A particular kind of machine-learning model — software whose behaviour was learned from data, instead of written by hand."
    >
      <WhatIsAnLLM />
      <p className="mt-6 text-sm text-ink-soft max-w-3xl">
        The rest of this section is about that frozen model: what comes out
        when you actually call it.
      </p>
    </Slide>
  );
}
