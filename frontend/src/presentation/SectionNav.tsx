/**
 * SectionNav — sticky left rail on the presentation page.
 * Shows the three sections (LLM / Agent / Use & build) and highlights the
 * sub-slide currently in view. Clicking a row smooth-scrolls to that slide.
 */
import type { SlideMeta } from './Slide';

type Props = {
  slides: (SlideMeta & { title: string })[];
  activeId: string | null;
  onJump: (id: string) => void;
};

const SECTIONS: { key: '1' | '2' | '3'; label: string }[] = [
  { key: '1', label: 'LLM' },
  { key: '2', label: 'Agent' },
  { key: '3', label: 'Use & build' },
];

export function SectionNav({ slides, activeId, onJump }: Props) {
  return (
    <nav className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-10">
      <ul className="space-y-6">
        {SECTIONS.map((section) => {
          const items = slides.filter((s) => s.section === section.key);
          const sectionActive = items.some((it) => it.id === activeId);
          return (
            <li key={section.key}>
              <div
                className={`text-[10px] font-mono uppercase tracking-wider mb-2 ${
                  sectionActive ? 'text-ink' : 'text-ink-muted'
                }`}
              >
                §{section.key} · {section.label}
              </div>
              <ul className="space-y-1">
                {items.map((it) => {
                  const active = it.id === activeId;
                  return (
                    <li key={it.id}>
                      <button
                        onClick={() => onJump(it.id)}
                        className={`group flex items-center gap-2 text-left ${
                          active ? 'text-ink' : 'text-ink-muted hover:text-ink'
                        }`}
                      >
                        <span
                          className={`block w-6 h-px transition-all ${
                            active ? 'bg-accent w-8' : 'bg-ink-muted/40 group-hover:bg-ink-muted'
                          }`}
                        />
                        <span className="text-xs">{it.number}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
