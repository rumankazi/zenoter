/**
 * Theme Configuration
 * Defines color palettes and styling values for light and dark themes
 */

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  border: string;
  borderHover: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeShadows {
  small: string;
  medium: string;
  large: string;
}

export interface Theme {
  colors: ThemeColors;
  shadows: ThemeShadows;
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

/**
 * Light theme configuration
 */
export const lightTheme: Theme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    background: '#ffffff',
    surface: '#f5f5f5',
    surfaceHover: '#eeeeee',
    text: '#1a1a1a',
    textSecondary: '#6b7280',
    border: '#e0e0e0',
    borderHover: '#d0d0d0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  shadows: {
    small: '0 1px 2px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px rgba(0, 0, 0, 0.15)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

/**
 * Dark theme configuration
 */
export const darkTheme: Theme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    surfaceHover: '#383838',
    text: '#f5f5f5',
    textSecondary: '#9ca3af',
    border: '#404040',
    borderHover: '#505050',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
  shadows: {
    small: '0 1px 2px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.4)',
    large: '0 10px 15px rgba(0, 0, 0, 0.5)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

/**
 * Get theme object by resolved theme value
 */
export function getTheme(resolvedTheme: ResolvedTheme): Theme {
  return resolvedTheme === 'dark' ? darkTheme : lightTheme;
}
