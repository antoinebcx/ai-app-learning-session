/**
 * useInView — small IntersectionObserver hook.
 * Returns true once the element scrolls into view, then stays true.
 * Used by illustrations that want to animate in the first time they appear.
 */
import { useEffect, useRef, useState } from 'react';

export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.3 }
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
          break;
        }
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}
