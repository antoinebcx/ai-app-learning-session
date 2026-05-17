/**
 * Badge — small inline label. Used for tags, event types, status pills.
 * Tones: `neutral` (gray) and `accent` (OpenAI green). Add tones sparingly.
 */
import type { ReactNode } from 'react';

type Tone = 'neutral' | 'accent';

const tones: Record<Tone, string> = {
  neutral: 'bg-ink/5 text-ink-soft',
  accent: 'bg-accent-soft text-accent border border-accent/30',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
