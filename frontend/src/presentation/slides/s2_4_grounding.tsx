/**
 * §2.4 — Grounding > clever prompting.
 * Pays off §1.4. The cure for hallucination is real data via tools.
 * Live demo: one click runs a real agent turn and the event panel proves
 * the loop is firing exactly as the diagram showed.
 */
import { Slide } from '../Slide';
import { LiveEventPanelMini } from '../illustrations/LiveEventPanelMini';

export function Slide_2_4() {
  return (
    <Slide
      id="2-4"
      section="2"
      sectionLabel="Agent"
      number="2.4"
      title="Grounding beats clever prompting."
      subtitle="When the answer must be real, don't reach for better adjectives — reach for tools. Real data from your systems is the actual cure for hallucination."
    >
      <LiveEventPanelMini />
      <p className="mt-6 text-sm text-ink-soft max-w-3xl">
        That's the agent loop from the previous slide, firing for real. Watch
        the event stream: <code className="font-mono text-xs">function_call</code> → tool runs →
        <code className="font-mono text-xs">function_call_output</code> → final{' '}
        <code className="font-mono text-xs">assistant message</code>.
      </p>
    </Slide>
  );
}
