/**
 * §2.2 — Tools are contracts.
 * The model decides what & when; your code decides how. The schema is the
 * contract that makes that division of labour work.
 */
import { Slide } from '../Slide';
import { ToolContractSplit } from '../illustrations/ToolContractSplit';

export function Slide_2_2() {
  return (
    <Slide
      id="2-2"
      section="2"
      sectionLabel="Agent"
      number="2.2"
      title="Tools are contracts."
      subtitle="You publish a JSON schema; the model returns arguments that fit it. The model picks what to call; your code decides how it runs."
    >
      <ToolContractSplit />
      <p className="mt-6 text-sm text-ink-soft max-w-3xl">
        Hover a field to see the link. Tip: tool descriptions <em>are</em> prompts —
        a vague <code className="font-mono text-xs">description</code> field is the most common reason the
        wrong tool gets picked.
      </p>
    </Slide>
  );
}
