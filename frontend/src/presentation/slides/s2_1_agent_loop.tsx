/**
 * §2.1 — The agent loop.
 * The single most important diagram of the deck. Once they see the loop,
 * everything in §2 falls into place.
 */
import { Slide } from '../Slide';
import { AgentLoopDiagram } from '../illustrations/AgentLoopDiagram';

export function Slide_2_1() {
  return (
    <Slide
      id="2-1"
      section="2"
      sectionLabel="Agent"
      number="2.1"
      title="The agent loop."
      subtitle="An agent is just an LLM with a loop around it. Call the model — if it asked for a tool, run it and feed the result back; if it didn't, you're done."
    >
      <AgentLoopDiagram />
    </Slide>
  );
}
