import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import profile from '../data/profile';

const name = profile.siteName;
const titles = {
  '/': `${name} | Travel, culture and Kabaddi`,
  '/my-story': `My Story | ${name}`,
  '/passions': `My Passions | ${name}`,
  '/journeys': `My Journeys | ${name}`,
  '/dream-destinations': `Dream Destinations | ${name}`,
  '/travel-map': `Travel Map | ${name}`,
  '/gallery': `Gallery | ${name}`,
  '/cultures': `Cultural Exploration | ${name}`,
  '/kabaddi': `Kabaddi | ${name}`,
  '/contact': `Contact | ${name}`,
};

// On navigation: scroll to #hash targets if present, otherwise jump to the top of the new page.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const base = Object.keys(titles).find((k) => k !== '/' && pathname.startsWith(k));
    document.title = titles[pathname] || (base ? titles[base] : titles['/']);
  }, [pathname]);

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
