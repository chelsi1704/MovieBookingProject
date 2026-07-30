import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {

  // Initialize from localStorage or default to dark
  // Dark theme is the default for this cinema app
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    // Default to dark if nothing saved
    return saved ? saved === 'dark' : true;
  });

  // Whenever isDark changes — apply to <html> element
  // Tailwind's darkMode:'class' watches for this class
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Toggle between dark and light
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook — use this everywhere instead of useContext(ThemeContext)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error(
    'useTheme must be used inside ThemeProvider'
  );
  return context;
};

export default ThemeContext;