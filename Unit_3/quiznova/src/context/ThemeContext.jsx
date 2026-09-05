import { createContext, useContext, useEffect, useState } from 'react';
import { getData, setData } from '../utils/storage';

const ThemeContext = createContext(null);

export const THEMES = {
  dark: { label: 'Midnight (Default)', icon: '🌙' },
  ocean: { label: 'Ocean Blue', icon: '🌊' },
  light: { label: 'Light', icon: '☀️' },
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getData('theme', 'dark'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setData('theme', theme);
  }, [theme]);

  function setTheme(t) { setThemeState(t); }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
