/**
 * §3.1 — Use it well in your daily work.
 * Frame: AI is great in some quadrants of the trust-stake matrix and bad in
 * others. A practical mental rule.
 */
import { Slide } from '../Slide';
import { TrustStakeMatrix } from '../illustrations/TrustStakeMatrix';

export function Slide_3_1() {
  return (
    <Slide
      id="3-1"
      section="3"
      sectionLabel="Use"
      number="3.1"
      title="Use it well in your daily work."
      subtitle="Two questions tell you whether to reach for AI on a given task: how accurate is it likely to be, and how bad if it's wrong?"
    >
      <TrustStakeMatrix />
      <ul className="mt-6 text-sm text-ink-soft max-w-3xl space-y-1 list-disc list-inside">
        <li><span className="text-ink font-medium">Give context aggressively</span> — paste the file, don't describe it.</li>
        <li><span className="text-ink font-medium">Verify; don't trust blindly</span> — checking is cheaper than debugging a wrong fix.</li>
        <li><span className="text-ink font-medium">Pick the right surface</span> — chat for asking, Cursor for inline edits, Claude Code for multi-file work.</li>
      </ul>
    </Slide>
  );
}
