import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_COLOR: Record<Theme, string> = { dark: '#131313', light: '#F7F7F5' };

/**
 * Dark for every visitor; light only when chosen. The pre-paint script in
 * index.html has already set data-theme on <html> from localStorage, so the
 * first render here is always 'dark' (matching the prerendered HTML) and the
 * real value is read after mount. Only an explicit choice is saved.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    if (document.documentElement.getAttribute('data-theme') === 'light') setThemeState('light');
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    const root = document.documentElement;
    root.setAttribute('data-theme', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next]);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be unavailable (private mode, blocked site data): the choice lasts this page view.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
