import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
type Preset = 'emerald' | 'neon' | 'amethyst' | 'oceanic';

interface ThemeContextType {
  theme: Theme;
  preset: Preset;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setPreset: (preset: Preset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const PALETTES = {
  emerald: {
    primary: '#4ade80',
    primaryDark: '#22c55e',
    primaryLight: '#86efac',
    dark: {
      bgPrimary: '#121212',
      bgSecondary: '#1e1e1e',
      bgTertiary: '#2d2d2d',
      cardAccent: '#18181b',
      textPrimary: '#ffffff' 
    }
  },
  neon: {
    primary: '#DAFF01',
    primaryDark: '#B6D600',
    primaryLight: '#E4FF4D',
    dark: {
      bgPrimary: '#111E26',
      bgSecondary: '#1C2E3A',
      bgTertiary: '#243B4A',
      cardAccent: '#0D161C',
      textPrimary: '#ffffff'
    }
  },
  amethyst: {
    primary: '#d8b4fe',
    primaryDark: '#c084fc',
    primaryLight: '#e9d5ff',
    dark: {
      bgPrimary: '#181025',
      bgSecondary: '#241a36',
      bgTertiary: '#32254a',
      cardAccent: '#130c1d',
      textPrimary: '#ffffff'
    }
  },
  oceanic: {
    primary: '#38bdf8',
    primaryDark: '#0284c7',
    primaryLight: '#7dd3fc',
    dark: {
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      cardAccent: '#020617',
      textPrimary: '#ffffff'
    }
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'dark';
  });

  const [preset, setPresetState] = useState<Preset>(() => {
    const savedPreset = localStorage.getItem('preset');
    return (savedPreset && Object.keys(PALETTES).includes(savedPreset)) ? (savedPreset as Preset) : 'emerald';
  });

  useEffect(() => {
    // 1. Sync Theme Class
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', theme);

    // 2. Sync Preset
    localStorage.setItem('preset', preset);

    // 3. Apply Variables
    const root = document.documentElement;
    const p = PALETTES[preset];

    // Primary Colors (applied in both modes, though usually stand out more in dark)
    root.style.setProperty('--primary', p.primary);
    root.style.setProperty('--primary-dark', p.primaryDark);
    root.style.setProperty('--primary-light', p.primaryLight);

    if (theme === 'light') {
        // Light Mode Overrides (Fixed light background standards)
        root.style.setProperty('--bg-primary', '#f3f4f6');
        root.style.setProperty('--bg-secondary', '#ffffff');
        root.style.setProperty('--bg-tertiary', '#e5e7eb');
        root.style.setProperty('--card-accent', '#ffffff');
        
        root.style.setProperty('--text-primary', '#111827');
        root.style.setProperty('--text-secondary', '#6b7280');
        
        root.style.setProperty('--input-bg', '#ffffff');
        root.style.setProperty('--input-border', '#d1d5db');
        
        root.style.setProperty('--modal-overlay', 'rgba(0, 0, 0, 0.5)');
        root.style.setProperty('--modal-bg', '#ffffff');
        root.style.setProperty('--border', '#e5e7eb');
        
        // Sidebar Light
        root.style.setProperty('--sidebar-bg', '#ffffff');
        root.style.setProperty('--sidebar-border', '#e5e7eb');
    } else {
        // Dark Mode: Use Palette specific darks
        root.style.setProperty('--bg-primary', p.dark.bgPrimary);
        root.style.setProperty('--bg-secondary', p.dark.bgSecondary);
        root.style.setProperty('--bg-tertiary', p.dark.bgTertiary);
        root.style.setProperty('--card-accent', p.dark.cardAccent);

        root.style.setProperty('--text-primary', p.dark.textPrimary);
        root.style.setProperty('--text-secondary', '#a3a3a3');
        
        root.style.setProperty('--input-bg', 'rgba(255, 255, 255, 0.05)');
        root.style.setProperty('--input-border', 'rgba(255, 255, 255, 0.1)');
        
        root.style.setProperty('--modal-overlay', 'rgba(0, 0, 0, 0.7)');
        root.style.setProperty('--modal-bg', p.dark.bgSecondary);
        root.style.setProperty('--border', 'rgba(255,255,255,0.1)'); 
        
        // Sidebar Dark
        root.style.setProperty('--sidebar-bg', '#18181b');
        root.style.setProperty('--sidebar-border', 'rgba(255,255,255,0.1)');
    }
  }, [theme, preset]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (t: Theme) => setThemeState(t);
  const setPreset = (p: Preset) => setPresetState(p);

  return (
    <ThemeContext.Provider value={{ theme, preset, toggleTheme, setTheme, setPreset }}>
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
