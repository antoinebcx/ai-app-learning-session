/**
 * ToolCatalog — two-column grid of "tool cards".
 *
 * The point: from the model's perspective, OpenAI's built-in tools and the
 * functions you write are the same thing — both expose a schema and return a
 * result. The visual is symmetric to underline that.
 */
type Tool = {
  name: string;
  description: string;
  icon: React.ReactNode;
};

const BUILTIN: Tool[] = [
  { name: 'web_search',       description: 'Live web search and citations.',           icon: <SearchIcon /> },
  { name: 'file_search',      description: 'Retrieval over uploaded files / vectors.', icon: <FileIcon /> },
  { name: 'code_interpreter', description: 'Sandboxed Python for data work.',          icon: <CodeIcon /> },
  { name: 'image_generation', description: 'Generate or edit images inline.',          icon: <ImageIcon /> },
];

const CUSTOM: Tool[] = [
  { name: 'lookup_order',           description: 'Read from your orders table.',           icon: <DotIcon /> },
  { name: 'issue_refund',           description: 'Trigger a refund in your payments API.', icon: <DotIcon /> },
  { name: 'send_slack_message',     description: 'Notify a channel from the agent.',       icon: <DotIcon /> },
  { name: 'summarize_findings',     description: 'Structured-output sink for research.',   icon: <DotIcon /> },
];

export function ToolCatalog() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Column label="Built-in" subtitle="OpenAI runs these." tone="accent" tools={BUILTIN} />
      <Column label="Custom" subtitle="You implement and host these." tone="amber" tools={CUSTOM} />
    </div>
  );
}

function Column({
  label,
  subtitle,
  tone,
  tools,
}: {
  label: string;
  subtitle: string;
  tone: 'accent' | 'amber';
  tools: Tool[];
}) {
  const head =
    tone === 'accent'
      ? 'bg-accent-soft text-accent'
      : 'bg-amber-50 text-amber-800';
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      <div className={`px-4 py-3 ${head} border-b border-line`}>
        <div className="text-xs font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-[11px] opacity-80 mt-0.5">{subtitle}</div>
      </div>
      <div className="divide-y divide-line-subtle">
        {tools.map((t) => (
          <div key={t.name} className="flex items-start gap-3 p-3">
            <div className="mt-0.5 text-ink-soft">{t.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-mono text-ink">{t.name}</div>
              <div className="text-xs text-ink-soft leading-relaxed">{t.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2 H10 L13 5 V14 H3 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 2 V5 H13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 4 L2 8 L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 4 L14 8 L11 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="7" r="1.5" fill="currentColor" />
      <path d="M2 11 L6 8 L10 12 L14 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DotIcon() {
  return (
    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
  );
}
