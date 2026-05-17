/**
 * §2.3 — Built-in tools, custom tools.
 * Same shape, different operator. The point is to make audiences comfortable
 * mixing both in one agent.
 */
import { Slide } from '../Slide';
import { ToolCatalog } from '../illustrations/ToolCatalog';

export function Slide_2_3() {
  return (
    <Slide
      id="2-3"
      section="2"
      sectionLabel="Agent"
      number="2.3"
      title="Built-in tools, custom tools."
      subtitle="From the model's point of view they're identical. OpenAI hosts a handful of batteries-included tools; everything specific to your system, you ship as a function."
    >
      <ToolCatalog />
      <p className="mt-6 text-sm text-ink-soft max-w-3xl">
        Default rule of thumb: built-ins for generic capabilities (search, code,
        files), custom for anything that touches your database, your APIs, or
        your business logic.
      </p>
    </Slide>
  );
}
