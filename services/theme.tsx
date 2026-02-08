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
  background: '#0F0F0F',
  surface: '#1C1C1C',
  text: '#F0F0F0',
  textSecondary: '#999999',
  textTertiary: '#777777',
  textMuted: '#555555',
  border: '#333333',
  borderLight: '#2A2A2A',
  inputBackground: '#1C1C1C',
  iconColor: '#E0E0E0',
  iconSecondary: '#777777',
  logoColor: '#F0F0F0',
  buttonBackground: '#F0F0F0',
  buttonText: '#0F0F0F',
  statusBarStyle: 'light',
  accent: '#999999',
  accentBlue: '#999999',
  accentRed: '#C07070',
  success: '#6BAF75',
  warning: '#D4AD4A',
  pending: '#888888',
  ratingColor: '#F0F0F0',
  linkColor: '#999999',
  subtitleColor: '#777777',
  onlineIndicatorBorder: '#0F0F0F',
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#999999',
  textMuted: '#BBBBBB',
  border: '#E0E0E0',
  borderLight: '#EEEEEE',
  inputBackground: '#F5F5F5',
  iconColor: '#333333',
  iconSecondary: '#999999',
  logoColor: '#1A1A1A',
  buttonBackground: '#1A1A1A',
  buttonText: '#FFFFFF',
  statusBarStyle: 'dark',
  accent: '#555555',
  accentBlue: '#555555',
  accentRed: '#B06060',
  success: '#5B9A65',
  warning: '#C9A340',
  pending: '#A0A0A0',
  ratingColor: '#1A1A1A',
  linkColor: '#6B6B6B',
  subtitleColor: '#888888',
  onlineIndicatorBorder: '#FFFFFF',
};

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  colors: lightColors,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

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
