/**
 * Button — one of four small visual primitives that compose the entire UI.
 * Variants: `primary` (accent fill), `secondary` (bordered), `ghost` (text only).
 * No fancy CSS-in-JS, just Tailwind utility strings selected by variant.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent/90',
  secondary: 'border border-line bg-surface text-ink hover:bg-surface-subtle',
  ghost: 'text-ink-soft hover:text-ink hover:bg-ink/5',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
