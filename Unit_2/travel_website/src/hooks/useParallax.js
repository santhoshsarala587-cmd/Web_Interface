import { useEffect } from 'react';

// Gently moves an element down as the page scrolls (slower than the content = depth).
// Does nothing when the visitor prefers reduced motion.
export default function useParallax(ref, speed = 0.25) {
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const parent = el.parentElement;
      const limit = parent ? parent.offsetHeight * 0.1 : 80;
      const y = Math.min(window.scrollY * speed, limit);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, speed]);
}
