/**
 * Left pane of the playground.
 * Three stacked sections — scenario picker, editable system prompt, and
 * tool toggles. Everything that defines "who the agent is" lives here.
 */
import { useState } from 'react';
import type { Scenario, ToolDef } from '../types';
import { TextArea } from '../design/TextArea';
import { Badge } from '../design/Badge';

type Props = {
  scenarios: Scenario[];
  selected: Scenario | null;
  onSelect: (s: Scenario) => void;
  instructions: string;
  onInstructionsChange: (v: string) => void;
  enabledTools: Set<string>;
  onToggleTool: (key: string) => void;
};

export function ScenarioPanel({
  scenarios,
  selected,
  onSelect,
  instructions,
  onInstructionsChange,
  enabledTools,
  onToggleTool,
}: Props) {
  return (
    <aside className="w-[320px] shrink-0 border-r border-line bg-surface-subtle overflow-y-auto">
      <div className="p-5 space-y-6">
        <Section title="Scenario">
          <div className="space-y-1.5">
            {scenarios.map((s) => {
              const active = selected?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelect(s)}
                  className={[
                    'w-full text-left rounded-md border p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                    active
                      ? 'border-accent/40 bg-accent-soft'
                      : 'border-line bg-surface hover:border-ink/20',
                  ].join(' ')}
                >
                  <div className="text-sm font-semibold text-ink">{s.name}</div>
                  <div className="mt-1 text-xs text-ink-soft leading-relaxed">
                    {s.tagline}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {selected && (
          <>
            <Section
              title="System prompt"
              hint="Edit and the next message uses your version."
            >
              <TextArea
                value={instructions}
                onChange={(e) => onInstructionsChange(e.target.value)}
                minRows={8}
                className="text-xs leading-relaxed font-mono"
              />
            </Section>

            <Section title="Tools" hint="Toggle individual tools on or off.">
              <div className="space-y-1.5">
                {selected.tools.map((t) => (
                  <ToolRow
                    key={toolKey(t)}
                    tool={t}
                    enabled={enabledTools.has(toolKey(t))}
                    onToggle={() => onToggleTool(toolKey(t))}
                  />
                ))}
              </div>
            </Section>
          </>
        )}
      </div>
    </aside>
  );
}

function toolKey(t: ToolDef): string {
  return t.type === 'function' ? t.name : t.type;
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {title}
      </div>
      {hint && <div className="mt-0.5 text-xs text-ink-soft">{hint}</div>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ToolRow({
  tool,
  enabled,
  onToggle,
}: {
  tool: ToolDef;
  enabled: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isFn = tool.type === 'function';

  return (
    <div
      className={`rounded-md border ${
        enabled ? 'border-line bg-surface' : 'border-line bg-surface opacity-60'
      }`}
    >
      <div className="flex items-center gap-2 p-2.5">
        <button
          onClick={onToggle}
          className={[
            'w-4 h-4 rounded border flex items-center justify-center transition',
            enabled
              ? 'bg-accent border-accent text-white'
              : 'border-ink-muted bg-surface',
          ].join(' ')}
          aria-pressed={enabled}
        >
          {enabled && (
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
              <path
                d="M2.5 6.5 5 9l4.5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 text-left flex items-center gap-2"
        >
          <span className="text-sm font-medium text-ink truncate">
            {isFn ? tool.name : tool.type}
          </span>
          {!isFn && <Badge tone="accent">built-in</Badge>}
        </button>
        <span className="text-xs text-ink-muted">{expanded ? '−' : '+'}</span>
      </div>
      {expanded && isFn && (
        <div className="px-2.5 pb-2.5 space-y-2">
          <p className="text-xs text-ink-soft leading-relaxed">{tool.description}</p>
          <pre className="text-[11px] leading-snug bg-surface-subtle rounded p-2 overflow-x-auto font-mono text-ink-soft border border-line-subtle">
            {JSON.stringify(tool.parameters, null, 2)}
          </pre>
        </div>
      )}
      {expanded && !isFn && (
        <div className="px-2.5 pb-2.5">
          <p className="text-xs text-ink-soft leading-relaxed">
            OpenAI-managed tool. The model uses it directly; we don't implement a
            handler.
          </p>
        </div>
      )}
    </div>
  );
}
