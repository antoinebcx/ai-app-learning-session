/**
 * TextArea — neutral, theme-consistent multiline input.
 * Auto-resizes between min and max heights based on content.
 */
import { forwardRef, useEffect, useRef, type TextareaHTMLAttributes } from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
};

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { className = '', autoResize = false, minRows = 3, maxRows = 12, value, ...rest },
  forwardedRef
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  function setRef(el: HTMLTextAreaElement | null) {
    innerRef.current = el;
    if (typeof forwardedRef === 'function') forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  }

  useEffect(() => {
    if (!autoResize) return;
    const el = innerRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const line = 24; // ~1.5rem
    const min = minRows * line;
    const max = maxRows * line;
    el.style.height = `${Math.min(max, Math.max(min, el.scrollHeight))}px`;
  }, [value, autoResize, minRows, maxRows]);

  return (
    <textarea
      ref={setRef}
      value={value}
      rows={autoResize ? undefined : minRows}
      className={`block w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/15 resize-none font-sans ${className}`}
      {...rest}
    />
  );
});
