/**
 * Presentation — the scroll-snapping container for the deck.
 *
 * Responsibilities:
 *   - Render every slide in a vertical scroll-snap column.
 *   - Track which slide is currently in view via IntersectionObserver and
 *     pipe that into the SectionNav.
 *   - Wire up keyboard navigation: ↓ / ↑ / Space / PgDn / PgUp jump
 *     between slides (with smooth scroll).
 *
 * Each slide is a self-contained component imported from ./slides.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { SectionNav } from './SectionNav';
import { slides } from './slides/registry';

export function Presentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(slides[0]?.meta.id ?? null);

  // Track which slide is "most visible" in the scroll container.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>('[data-slide]');
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible intersecting slide.
        let best: { id: string; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.getAttribute('data-slide-id');
          if (!id) continue;
          if (!best || e.intersectionRatio > best.ratio) {
            best = { id, ratio: e.intersectionRatio };
          }
        }
        if (best) setActiveId(best.id);
      },
      { root, threshold: [0.4, 0.6, 0.8] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const jumpTo = useCallback((id: string) => {
    const root = containerRef.current;
    const el = root?.querySelector<HTMLElement>(`[data-slide-id="${id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const move = useCallback(
    (direction: 1 | -1) => {
      const idx = slides.findIndex((s) => s.meta.id === activeId);
      const nextIdx = Math.max(0, Math.min(slides.length - 1, idx + direction));
      if (nextIdx !== idx) jumpTo(slides[nextIdx].meta.id);
    },
    [activeId, jumpTo]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        move(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        move(-1);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  return (
    <>
      <SectionNav
        slides={slides.map((s) => ({ ...s.meta, title: s.title }))}
        activeId={activeId}
        onJump={jumpTo}
      />
      <div
        ref={containerRef}
        className="snap-y snap-mandatory h-[calc(100vh-3.5rem)] overflow-y-scroll scroll-smooth"
      >
        {slides.map(({ Component, meta }) => (
          <Component key={meta.id} />
        ))}
      </div>
    </>
  );
}
