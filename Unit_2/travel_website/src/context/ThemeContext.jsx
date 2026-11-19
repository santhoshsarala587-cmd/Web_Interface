import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Light / dark theme. The choice is saved in localStorage; until the visitor picks one,
// the operating-system preference is followed. public/index.html applies the saved theme
// before the first paint so there is no flash.
const KEY = 'my-site-theme-v1';

const systemTheme = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const saved = () => {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'dark' || v === 'light' ? v : null;
  } catch (e) {
    return null;
  }
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => saved() || systemTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0e1612' : '#173d32');
  }, [theme]);

  // Follow the system setting while the visitor has not chosen
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (!saved()) setTheme(mq.matches ? 'dark' : 'light'); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try { window.localStorage.setItem(KEY, next); } catch (e) { /* storage unavailable */ }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
