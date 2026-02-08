import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'app_theme';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  inputBackground: string;
  iconColor: string;
  iconSecondary: string;
  logoColor: string;
  buttonBackground: string;
  buttonText: string;
  statusBarStyle: 'light' | 'dark';
  // Accents stay the same across themes
  accent: string;
  accentBlue: string;
  accentRed: string;
  success: string;
  warning: string;
  pending: string;
  ratingColor: string;
  linkColor: string;
  subtitleColor: string;
  onlineIndicatorBorder: string;
}

export const darkColors: ThemeColors = {
  background: '#0A0A0A',
  surface: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textTertiary: '#888888',
  textMuted: '#666666',
  border: '#333333',
  borderLight: '#2A2A2A',
  inputBackground: '#1A1A1A',
  iconColor: '#FFFFFF',
  iconSecondary: '#888888',
  logoColor: '#FFFFFF',
  buttonBackground: '#FFFFFF',
  buttonText: '#0A0A0A',
  statusBarStyle: 'light',
  accent: '#4CAF50',
  accentBlue: '#0057B8',
  accentRed: '#E3000F',
  success: '#4CAF50',
  warning: '#FFC107',
  pending: '#9E9E9E',
  ratingColor: '#4CAF50',
  linkColor: '#4CAF50',
  subtitleColor: '#6B8AAF',
  onlineIndicatorBorder: '#0A0A0A',
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#888888',
  textMuted: '#AAAAAA',
  border: '#E0E0E0',
  borderLight: '#EEEEEE',
  inputBackground: '#F5F5F5',
  iconColor: '#1A1A1A',
  iconSecondary: '#888888',
  logoColor: '#1A1A1A',
  buttonBackground: '#1A1A1A',
  buttonText: '#FFFFFF',
  statusBarStyle: 'dark',
  accent: '#4CAF50',
  accentBlue: '#0057B8',
  accentRed: '#E3000F',
  success: '#4CAF50',
  warning: '#FFC107',
  pending: '#9E9E9E',
  ratingColor: '#4CAF50',
  linkColor: '#4CAF50',
  subtitleColor: '#5A7A9F',
  onlineIndicatorBorder: '#FFFFFF',
};

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: darkColors,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const colors = mode === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
