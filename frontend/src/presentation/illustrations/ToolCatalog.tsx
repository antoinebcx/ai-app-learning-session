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
  { name: 'lookup_order',       description: 'Read from your orders table.',           icon: <DatabaseIcon /> },
  { name: 'issue_refund',       description: 'Trigger a refund in your payments API.', icon: <CurrencyIcon /> },
  { name: 'send_slack_message', description: 'Notify a channel from the agent.',       icon: <ChatIcon /> },
  { name: 'summarize_findings', description: 'Structured-output sink for research.',   icon: <ListIcon /> },
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
function DatabaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="4" rx="5" ry="1.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 4 V8 C3 9 5.2 10 8 10 C10.8 10 13 9 13 8 V4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8 V12 C3 13 5.2 14 8 14 C10.8 14 13 13 13 12 V8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function CurrencyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5 V11.5 M10 6 C10 5.2 9 5 8 5 C7 5 6 5.5 6 6.5 C6 8.5 10 7.5 10 9.5 C10 10.5 9 11 8 11 C7 11 6 10.8 6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 4 H13.5 V11 H7 L4.5 13 V11 H2.5 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="5" y1="4" x2="13" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2.8" cy="4" r="0.9" fill="currentColor" />
      <circle cx="2.8" cy="8" r="0.9" fill="currentColor" />
      <circle cx="2.8" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}
