/**
 * Slide — one viewport-tall section of the presentation.
 * Every slide shares the same layout: a small "§X · N.N · LABEL" tag at the
 * top, then a title, then children (prose + an illustration). Scroll-snap is
 * applied here so the parent Presentation just needs `snap-y`.
 */
import type { ReactNode } from 'react';

export type SlideMeta = {
  id: string;
  /** Section grouping shown in the nav. */
  section: '1' | '2' | '3' | 'intro' | 'outro';
  sectionLabel?: string;
  /** Optional sub-number like "1.1". Omitted for intro/outro. */
  number?: string;
};

type Props = SlideMeta & {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function Slide({
  id,
  section,
  sectionLabel,
  number,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <section
      id={`slide-${id}`}
      data-slide
      data-slide-id={id}
      data-slide-section={section}
      className="snap-start min-h-[calc(100vh-3.5rem)] flex flex-col justify-center px-6 sm:px-12 py-16"
    >
      <div className="max-w-5xl w-full mx-auto">
        {(sectionLabel || number) && (
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-4">
            {sectionLabel && (
              <>
                <span>§{section}</span>
                <span className="opacity-50">·</span>
                <span>{sectionLabel}</span>
              </>
            )}
            {number && (
              <>
                <span className="opacity-50">·</span>
                <span>{number}</span>
              </>
            )}
          </div>
        )}
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.1]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg sm:text-xl text-ink-soft leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
