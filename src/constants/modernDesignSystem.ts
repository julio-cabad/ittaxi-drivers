import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const COLORS = {
  primary: {
    main: '#667eea',
    light: '#818cf8',
    dark: '#5b21b6',
    gradient: ['#667eea', '#764ba2'],
  },
  secondary: {
    main: '#f093fb',
    light: '#f5b8fc',
    dark: '#e879f9',
    gradient: ['#f093fb', '#f5576c'],
  },
  accent: {
    main: '#fbbf24',
    light: '#fde68a',
    dark: '#f59e0b',
    gradient: ['#fbbf24', '#f97316'],
  },
  background: {
    main: '#1e293b',
    light: '#334155',
    dark: '#0f172a',
    card: '#2d3748',
    overlay: 'rgba(0, 0, 0, 0.5)',
    glass: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    disabled: '#64748b',
    inverse: '#1e293b',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  border: {
    main: 'rgba(255, 255, 255, 0.2)',
    focus: '#667eea',
    error: '#ef4444',
    success: '#10b981',
  },
};

export const GRADIENTS = {
  primary: {
    colors: ['#667eea', '#764ba2', '#8b5cf6'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  secondary: {
    colors: ['#f093fb', '#f5576c', '#ff006e'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  success: {
    colors: ['#10b981', '#059669', '#047857'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  error: {
    colors: ['#ef4444', '#dc2626', '#b91c1c'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  dark: {
    colors: ['#1e293b', '#0f172a', '#020617'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    primary: {
      shadowColor: COLORS.primary.main,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 0,
    },
    secondary: {
      shadowColor: COLORS.secondary.main,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 0,
    },
    accent: {
      shadowColor: COLORS.accent.main,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 0,
    },
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const ANIMATION_CONFIG = {
  spring: {
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
  timing: {
    duration: 300,
  },
};

export const ANIMATION_DURATIONS = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

export const ANIMATION_DELAYS = {
  stagger: 50,
  short: 100,
  medium: 200,
  long: 300,
};

export const BREAKPOINTS = {
  small: 320,
  medium: 768,
  large: 1024,
  xlarge: 1440,
};

export const Z_INDEX = {
  background: -1,
  content: 1,
  overlay: 10,
  modal: 100,
  popover: 200,
  tooltip: 300,
  toast: 400,
};

export const INPUT_STATES = {
  default: {
    borderColor: COLORS.border.main,
    backgroundColor: COLORS.background.glass,
  },
  focus: {
    borderColor: COLORS.border.focus,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  error: {
    borderColor: COLORS.border.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  success: {
    borderColor: COLORS.border.success,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  disabled: {
    borderColor: COLORS.border.main,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
};

export const BUTTON_STATES = {
  default: {
    opacity: 1,
    scale: 1,
  },
  pressed: {
    opacity: 0.9,
    scale: 0.98,
  },
  disabled: {
    opacity: 0.5,
    scale: 1,
  },
  loading: {
    opacity: 0.8,
    scale: 1,
  },
};

export const getResponsiveValue = (
  smallValue: number,
  mediumValue: number,
  largeValue: number
): number => {
  if (SCREEN_WIDTH < BREAKPOINTS.medium) {
    return smallValue;
  } else if (SCREEN_WIDTH < BREAKPOINTS.large) {
    return mediumValue;
  }
  return largeValue;
};

export const isSmallScreen = () => SCREEN_WIDTH < BREAKPOINTS.medium;
export const isMediumScreen = () => 
  SCREEN_WIDTH >= BREAKPOINTS.medium && SCREEN_WIDTH < BREAKPOINTS.large;
export const isLargeScreen = () => SCREEN_WIDTH >= BREAKPOINTS.large;

export default {
  COLORS,
  GRADIENTS,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
  BORDER_RADIUS,
  ANIMATION_CONFIG,
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  BREAKPOINTS,
  Z_INDEX,
  INPUT_STATES,
  BUTTON_STATES,
  getResponsiveValue,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
};