/**
 * §1.2 — Tokens, not letters.
 * Drives home the unit the model thinks in, and the practical consequences:
 * cost, context-window math, edge cases (code, emoji, non-English).
 */
import { Slide } from '../Slide';
import { TokenSplit } from '../illustrations/TokenSplit';

export function Slide_1_2() {
  return (
    <Slide
      id="1-2"
      section="1"
      sectionLabel="LLM"
      number="1.2"
      title="Tokens, not letters."
      subtitle="The model doesn't see characters or words — it sees tokens, each one an integer in a vocabulary of ~100K. This is what gets billed, counted against context limits, and streamed back to you."
    >
      <TokenSplit />
      <p className="mt-6 text-sm text-ink-soft max-w-3xl">
        Rule of thumb: ~4 characters per token for English prose. Code, emoji,
        and non-English text use more tokens per character — which means more
        cost and faster context exhaustion.
      </p>
    </Slide>
  );
}
