/**
 * §1.3 — Context window.
 * The model's working memory. Whatever you don't send doesn't exist.
 * Stateless by default — you re-send history every turn.
 */
import { Slide } from '../Slide';
import { ContextWindowBar } from '../illustrations/ContextWindowBar';

export function Slide_1_3() {
  return (
    <Slide
      id="1-3"
      section="1"
      sectionLabel="LLM"
      number="1.3"
      title="Context window — the working memory."
      subtitle="Everything the model knows during one call is what you put in the prompt. Tools, system messages, conversation history, file contents — all of it shares one finite budget."
    >
      <ContextWindowBar />
      <p className="mt-6 text-sm text-ink-soft max-w-3xl">
        Stateless by default: across two API calls, nothing carries over unless
        you re-send it (or use stateful options like <code className="font-mono text-xs">previous_response_id</code>).
      </p>
    </Slide>
  );
}
