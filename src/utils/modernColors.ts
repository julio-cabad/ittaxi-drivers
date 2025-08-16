/**
 * Modern Color System
 * Enhanced color palette with gradients and semantic tokens
 */

// Base Color Palette (keeping existing colors for compatibility)
export const BASE_COLORS = {
  // Primary brand colors
  primary: '#1c3a69',
  secondary: '#2563eb',
  accent: '#3b82f6',

  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // State colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// Modern Gradient Definitions
export const GRADIENTS = {
  // Primary gradients
  primary: ['#667eea', '#764ba2'],
  primaryLight: ['#a8edea', '#fed6e3'],
  primaryDark: ['#1c3a69', '#2563eb'],

  // Secondary gradients
  secondary: ['#f093fb', '#f5576c'],
  secondaryLight: ['#ffecd2', '#fcb69f'],
  secondaryDark: ['#667eea', '#764ba2'],

  // State gradients
  success: ['#4facfe', '#00f2fe'],
  successLight: ['#a8edea', '#fed6e3'],

  error: ['#ff9a9e', '#fecfef'],
  errorLight: ['#ffeaa7', '#fab1a0'],

  warning: ['#fdbb2d', '#22c1c3'],
  warningLight: ['#fff7ad', '#ffa726'],

  // Background gradients
  background: ['#667eea', '#764ba2', '#f093fb'],
  backgroundLight: ['#ffecd2', '#fcb69f', '#a8edea'],
  backgroundDark: ['#1c3a69', '#2563eb', '#1e40af'],

  // Neutral gradients
  neutral: ['#f7fafc', '#edf2f7'],
  neutralDark: ['#2d3748', '#4a5568'],

  // Glass morphism backgrounds
  glass: ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)'],
  glassDark: ['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.1)'],
} as const;

// Shadow Colors
export const SHADOW_COLORS = {
  primary: 'rgba(102, 126, 234, 0.3)',
  secondary: 'rgba(245, 87, 108, 0.3)',
  success: 'rgba(79, 172, 254, 0.3)',
  error: 'rgba(255, 154, 158, 0.3)',
  warning: 'rgba(253, 187, 45, 0.3)',

  // Neutral shadows
  light: 'rgba(0, 0, 0, 0.1)',
  medium: 'rgba(0, 0, 0, 0.15)',
  dark: 'rgba(0, 0, 0, 0.25)',

  // Glow effects
  glow: 'rgba(102, 126, 234, 0.5)',
  glowSuccess: 'rgba(79, 172, 254, 0.5)',
  glowError: 'rgba(255, 154, 158, 0.5)',
} as const;

// Semantic Color Tokens
export const SEMANTIC_COLORS = {
  // Text colors
  text: {
    primary: BASE_COLORS.gray[900],
    secondary: BASE_COLORS.gray[600],
    tertiary: BASE_COLORS.gray[500],
    inverse: BASE_COLORS.white,
    placeholder: BASE_COLORS.gray[400],
    disabled: BASE_COLORS.gray[300],
  },

  // Background colors
  background: {
    primary: BASE_COLORS.white,
    secondary: BASE_COLORS.gray[50],
    tertiary: BASE_COLORS.gray[100],
    inverse: BASE_COLORS.gray[900],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Border colors
  border: {
    primary: BASE_COLORS.gray[300],
    secondary: BASE_COLORS.gray[200],
    focus: BASE_COLORS.primary,
    error: BASE_COLORS.error,
    success: BASE_COLORS.success,
  },

  // Interactive states
  interactive: {
    primary: BASE_COLORS.primary,
    primaryHover: '#15365a',
    primaryActive: '#0f2a47',
    primaryDisabled: BASE_COLORS.gray[300],

    secondary: BASE_COLORS.secondary,
    secondaryHover: '#1d4ed8',
    secondaryActive: '#1e40af',
    secondaryDisabled: BASE_COLORS.gray[300],
  },
} as const;

// Gradient Utility Functions
export const createGradient = (
  colors: string[],
  angle: number = 45,
): string => {
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
};

export const getGradientColors = (
  gradientName: keyof typeof GRADIENTS,
): readonly string[] => {
  return GRADIENTS[gradientName];
};

// Color Utility Functions
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getShadowColor = (
  colorName: keyof typeof SHADOW_COLORS,
): string => {
  return SHADOW_COLORS[colorName];
};

// Theme-aware color selection
export const getThemedColor = (
  lightColor: string,
  darkColor: string,
  isDark: boolean = false,
): string => {
  return isDark ? darkColor : lightColor;
};

// No backward compatibility exports to avoid conflicts with colors.ts
// Use the original colors from colors.ts for existing components
