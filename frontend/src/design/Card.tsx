/**
 * Card — a bordered surface used for grouping. The only "decoration" in the
 * design system: subtle border, soft shadow, generous padding by default.
 */
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

export function Card({ children, className = '', padded = true }: Props) {
  return (
    <div
      className={`rounded-lg border border-line bg-surface shadow-card ${
        padded ? 'p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
