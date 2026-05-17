/**
 * Kbd — visual keyboard shortcut, e.g. for slide navigation hints.
 */
import type { ReactNode } from 'react';

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-subtle text-[11px] font-mono text-ink-soft">
      {children}
    </kbd>
  );
}
