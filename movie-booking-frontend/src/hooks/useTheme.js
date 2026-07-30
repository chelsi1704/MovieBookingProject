import { useContext, useCallback, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom hook for theme functionality
 * Provides access to theme state and methods
 * 
 * @returns {object} Theme hook object
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { theme, toggleTheme, setTheme } = context;

  /**
   * Toggle between dark and light theme
   */
  const toggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  /**
   * Set theme to specific mode
   */
  const set = useCallback(
    (mode) => {
      if (mode === 'dark' || mode === 'light') {
        setTheme(mode);
      }
    },
    [setTheme]
  );

  /**
   * Check if current theme is dark
   */
  const isDark = useCallback(() => {
    return theme === 'dark';
  }, [theme]);

  /**
   * Check if current theme is light
   */
  const isLight = useCallback(() => {
    return theme === 'light';
  }, [theme]);

  /**
   * Get opposite theme
   */
  const getOppositeTheme = useCallback(() => {
    return theme === 'dark' ? 'light' : 'dark';
  }, [theme]);

  /**
   * Get theme colors
   */
  const getThemeColors = useCallback(() => {
    return {
      dark: {
        bg: '#0f172a', // slate-900
        secondary: '#1e293b', // slate-800
        tertiary: '#334155', // slate-700
        text: '#f1f5f9', // slate-100
        muted: '#cbd5e1', // slate-400
        border: '#475569', // slate-600
        primary: '#3b82f6', // blue-500
      },
      light: {
        bg: '#f8fafc', // slate-50
        secondary: '#f1f5f9', // slate-100
        tertiary: '#e2e8f0', // slate-200
        text: '#0f172a', // slate-900
        muted: '#64748b', // slate-500
        border: '#cbd5e1', // slate-400
        primary: '#2563eb', // blue-600
      },
    }[theme];
  }, [theme]);

  /**
   * Apply theme to document
   */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  /**
   * Listen for system theme preference changes
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Optional: Update theme based on system preference
      // This is commented out to respect user's manual selection
      // setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return {
    // State
    theme,

    // Methods
    toggle,
    set,

    // Utility methods
    isDark,
    isLight,
    getOppositeTheme,
    getThemeColors,

    // Aliases for convenience
    toggleTheme: toggle,
    setTheme: set,
  };
};

export default useTheme;
