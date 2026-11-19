import { useEffect, useState } from 'react';
import useInView from '../hooks/useInView';

// Counts up from 0 to `to` once, when it scrolls into view. With reduced motion it just shows the number.
export default function Counter({ to, duration = 1400, suffix = '' }) {
  const [ref, seen] = useInView(0.5);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!seen) return undefined;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || to === 0) {
      setValue(to);
      return undefined;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, to, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">{value}{suffix}</span>
      <span className="visually-hidden">{to}{suffix}</span>
    </span>
  );
}
