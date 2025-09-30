import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { ThemeContextType } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    // Fallback for invalid hex
    return `rgba(74, 144, 226, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<string>('#4A90E2');
  const [isSanctuaryActive, setIsSanctuaryActiveState] = useState<boolean>(false);
  const [sanctuaryMemory, setSanctuaryMemory] = useState<string | null>(null);

  useEffect(() => {
    if (isSanctuaryActive) {
      document.body.classList.add('sanctuary-active');
    } else {
      document.body.classList.remove('sanctuary-active');
    }
  }, [isSanctuaryActive]);

  const changeAccentColor = useCallback((newColor: string) => {
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
        setAccentColor(newColor);
        const root = document.documentElement;
        root.style.setProperty('--primary-accent-color', newColor);
        root.style.setProperty('--widget-border-color', hexToRgba(newColor, 0.3));
        root.style.setProperty('--glow-color', hexToRgba(newColor, 0.5));
    }
  }, []);

  const setSanctuaryActive = useCallback((isActive: boolean, memory?: string) => {
    setIsSanctuaryActiveState(isActive);
    if (isActive && memory) {
        setSanctuaryMemory(memory);
    } else if (!isActive) {
        setSanctuaryMemory(null);
    }
  }, []);

  const value = { accentColor, changeAccentColor, isSanctuaryActive, setSanctuaryActive, sanctuaryMemory };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
