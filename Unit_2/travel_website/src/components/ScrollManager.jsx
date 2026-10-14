import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// On navigation: scroll to #hash targets if present, otherwise jump to the top of the new page.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        // Wait a frame so the page has rendered
        const id = requestAnimationFrame(() => el.scrollIntoView());
        return () => cancelAnimationFrame(id);
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return undefined;
  }, [pathname, hash]);

  return null;
}
