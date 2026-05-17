/**
 * §1.1 — Hello, model.
 * Sets the foundational mental model: an LLM is a function from tokens to a
 * probability distribution over the next token, sampled.
 */
import { Slide } from '../Slide';
import { NextTokenPredictor } from '../illustrations/NextTokenPredictor';

export function Slide_1_1() {
  return (
    <Slide
      id="1-1"
      section="1"
      sectionLabel="LLM"
      number="1.1"
      title="Hello, model."
      subtitle="An LLM is, deep down, one function: given a sequence of tokens, return a probability distribution over what comes next. Then sample. Then repeat."
    >
      <NextTokenPredictor />
      <p className="mt-6 text-sm text-ink-soft max-w-2xl">
        Most of the weird behaviour you'll meet — repetition, hedging, confident
        nonsense — falls out of this. It's not thinking, it's choosing the most
        plausible next chunk.
      </p>
    </Slide>
  );
}
