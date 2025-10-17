/**
 * Theme Context
 * Provides theme state management with support for light, dark, and auto modes
 */

import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import type { ThemeMode, ResolvedTheme } from '../styles/theme';

interface ThemeContextValue {
  /** User's theme preference (light, dark, or auto) */
  mode: ThemeMode;

  /** Actual theme being displayed (light or dark) */
  resolvedTheme: ResolvedTheme;

  /** Set the theme mode */
  setMode: (mode: ThemeMode) => void;

  /** Toggle between modes: auto → light → dark → auto */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Provider Component
 * Manages theme state, system preference detection, and localStorage persistence
 */
export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  // Initialize mode from localStorage or default to 'auto'
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('zenoter-theme-mode');
    return (saved as ThemeMode) || 'auto';
  });

  // Track the resolved theme (what's actually displayed)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Listen to system preference and update resolved theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      if (mode === 'auto') {
        // In auto mode, follow system preference
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        // In manual mode, use the selected mode
        setResolvedTheme(mode);
      }
    };

    // Initial update
    updateResolvedTheme();

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (mode === 'auto') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [mode]);

  // Apply theme to DOM and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('zenoter-theme-mode', mode);
  }, [mode, resolvedTheme]);

  // Toggle function: switches between light and dark only
  const toggleTheme = () => {
    setMode((current) => {
      // If in auto mode, switch based on current resolved theme
      if (current === 'auto') {
        return resolvedTheme === 'dark' ? 'light' : 'dark';
      }
      // Toggle between light and dark
      return current === 'light' ? 'dark' : 'light';
    });
  };

  const value: ThemeContextValue = {
    mode,
    resolvedTheme,
    setMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook to access theme context
 * Must be used within ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
