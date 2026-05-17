/**
 * TokenSplit — live tokenizer widget.
 *
 * Uses `gpt-tokenizer` (cl100k_base by default) to split user-entered text
 * into actual model tokens. Each token gets a coloured chip with its decoded
 * text and integer id. Presets demonstrate that tokens ≠ words: rare words,
 * code, emoji, and non-English text all behave differently.
 */
import { useMemo, useState } from 'react';
import { encode, decode } from 'gpt-tokenizer';
import { TextArea } from '../../design/TextArea';

const PRESETS: { label: string; text: string }[] = [
  { label: 'English', text: 'The quick brown fox jumps over the lazy dog.' },
  { label: 'Code', text: 'function add(a, b) {\n  return a + b;\n}' },
  { label: 'Emoji', text: 'Building with AI 💚🚀✨ is fun!' },
  { label: 'Rare word', text: 'antidisestablishmentarianism' },
  { label: 'French', text: "Bonjour, je m'appelle Claude." },
];

// Soft pastel palette so adjacent tokens stay visually distinct.
const COLORS = [
  'bg-emerald-100 text-emerald-900',
  'bg-amber-100 text-amber-900',
  'bg-sky-100 text-sky-900',
  'bg-rose-100 text-rose-900',
  'bg-violet-100 text-violet-900',
  'bg-cyan-100 text-cyan-900',
];

export function TokenSplit() {
  const [text, setText] = useState(PRESETS[0].text);

  const tokens = useMemo(() => {
    try {
      const ids = encode(text);
      return ids.map((id) => ({ id, text: decode([id]) }));
    } catch {
      return [];
    }
  }, [text]);

  const charsPerToken =
    tokens.length === 0 ? 0 : text.length / tokens.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Your text</Label>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          minRows={4}
          className="mt-2 font-mono"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setText(p.text)}
              className="px-2.5 py-1 text-xs rounded-md border border-line bg-surface hover:border-ink/20 text-ink-soft hover:text-ink transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <Label>Tokens</Label>
          <div className="text-xs font-mono text-ink-muted tabular-nums">
            {text.length} chars · {tokens.length} tokens ·{' '}
            {charsPerToken.toFixed(2)} c/t
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1 p-4 rounded-md border border-line bg-surface-subtle min-h-32 font-mono text-sm leading-relaxed">
          {tokens.length === 0 && (
            <span className="text-ink-muted text-xs italic">
              Start typing to see tokens.
            </span>
          )}
          {tokens.map((t, i) => (
            <Token key={i} text={t.text} id={t.id} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Token({
  text,
  id,
  index,
}: {
  text: string;
  id: number;
  index: number;
}) {
  const display = text.replace(/\n/g, '↵').replace(/ /g, '·');
  return (
    <span
      title={`token id: ${id}`}
      className={`px-1.5 py-0.5 rounded ${COLORS[index % COLORS.length]}`}
    >
      {display || '∅'}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
      {children}
    </div>
  );
}
