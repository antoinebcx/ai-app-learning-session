/**
 * ToolContractSplit — schema vs example call, side by side.
 *
 * Left: the tool definition (JSON schema you ship to the model).
 * Right: a tool call the model produced (arguments the model invented,
 * constrained by the schema). Hovering a field on either side highlights
 * the same field on the other side — making the "schema ⇒ shape of call"
 * relationship feel concrete.
 */
import { useState } from 'react';

type FieldId = 'name' | 'location' | 'units';

export function ToolContractSplit() {
  const [hovered, setHovered] = useState<FieldId | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Panel label="Tool definition (you write)">
        <SchemaCode hovered={hovered} setHovered={setHovered} />
      </Panel>
      <Panel label="Tool call (model produces)">
        <CallCode hovered={hovered} setHovered={setHovered} />
      </Panel>
    </div>
  );
}

function Panel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface">
      <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-ink-muted border-b border-line">
        {label}
      </div>
      <div className="p-4 font-mono text-[13px] leading-relaxed text-ink whitespace-pre">
        {children}
      </div>
    </div>
  );
}

function Highlight({
  id,
  hovered,
  setHovered,
  children,
}: {
  id: FieldId;
  hovered: FieldId | null;
  setHovered: (id: FieldId | null) => void;
  children: React.ReactNode;
}) {
  const active = hovered === id;
  return (
    <span
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      className={`rounded px-0.5 -mx-0.5 transition cursor-pointer ${
        active ? 'bg-accent-soft text-accent' : 'hover:bg-line-subtle'
      }`}
    >
      {children}
    </span>
  );
}

function SchemaCode({
  hovered,
  setHovered,
}: {
  hovered: FieldId | null;
  setHovered: (id: FieldId | null) => void;
}) {
  const H = (id: FieldId, children: React.ReactNode) => (
    <Highlight id={id} hovered={hovered} setHovered={setHovered}>
      {children}
    </Highlight>
  );
  return (
    <>{'{'}
{'\n  "type": "function",'}
{'\n  "name": '}{H('name', '"get_weather"')}{','}
{'\n  "description": "Get current weather for a location.",'}
{'\n  "parameters": {'}
{'\n    "type": "object",'}
{'\n    "properties": {'}
{'\n      '}{H('location', '"location"')}{': { "type": "string" },'}
{'\n      '}{H('units', '"units"')}{': { "type": "string",'}
{'\n               "enum": ["celsius", "fahrenheit"] }'}
{'\n    },'}
{'\n    "required": ["location", "units"]'}
{'\n  },'}
{'\n  "strict": true'}
{'\n}'}</>
  );
}

function CallCode({
  hovered,
  setHovered,
}: {
  hovered: FieldId | null;
  setHovered: (id: FieldId | null) => void;
}) {
  const H = (id: FieldId, children: React.ReactNode) => (
    <Highlight id={id} hovered={hovered} setHovered={setHovered}>
      {children}
    </Highlight>
  );
  return (
    <>{'{'}
{'\n  "type": "function_call",'}
{'\n  "name": '}{H('name', '"get_weather"')}{','}
{'\n  "call_id": "call_8m4XCnYvEmFlzHgDHbaO…",'}
{'\n  "arguments": {'}
{'\n    '}{H('location', '"location"')}{': "Paris, France",'}
{'\n    '}{H('units', '"units"')}{': "celsius"'}
{'\n  }'}
{'\n}'}</>
  );
}
