import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    // Default to dark
    return 'dark';
  });

  useEffect(() => {
    // Apply theme to document body
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', theme);
    
    // Update CSS variables based on theme
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f3f4f6');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-tertiary', '#e5e7eb');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--border', '#e5e7eb');
      root.style.setProperty('--border', '#e5e7eb');
      root.style.setProperty('--sidebar-bg', '#ffffff');
      root.style.setProperty('--card-accent', '#ffffff');
      root.style.setProperty('--input-bg', '#ffffff');
      root.style.setProperty('--input-border', '#e5e7eb');
      root.style.setProperty('--modal-overlay', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--modal-bg', '#ffffff');
    } else {
      // Revert to dark variables (defined in CSS :root)
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--bg-secondary');
      root.style.removeProperty('--bg-tertiary');
      root.style.removeProperty('--text-primary');
      root.style.removeProperty('--text-secondary');
      root.style.removeProperty('--border');
      root.style.removeProperty('--border');
      root.style.removeProperty('--sidebar-bg');
      root.style.removeProperty('--card-accent');
      root.style.removeProperty('--input-bg');
      root.style.removeProperty('--input-border');
      root.style.removeProperty('--modal-overlay');
      root.style.removeProperty('--modal-bg');
    }
    
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
