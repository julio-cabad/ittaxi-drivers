/**
 * Modern Design System
 * Centralized design tokens for spacing, typography, shadows, and layout
 */

// Spacing System (based on 4px grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
} as const;

// Typography System
export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
} as const;

// Border Radius System
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// Shadow System
export const SHADOWS = {
  // Card shadows
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHover: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  // Button shadows
  button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  buttonPressed: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Input shadows
  input: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  inputFocused: {
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },

  // Glow effects
  glow: {
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 0,
  },

  glowStrong: {
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 0,
  },
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  sm: 375, // Small phones
  md: 414, // Large phones
  lg: 768, // Tablets
  xl: 1024, // Large tablets
} as const;

// Component Sizes
export const COMPONENT_SIZES = {
  // Button sizes
  button: {
    small: {
      height: 36,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: TYPOGRAPHY.fontSize.sm,
    },
    medium: {
      height: 44,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    large: {
      height: 56,
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.lg,
      fontSize: TYPOGRAPHY.fontSize.lg,
    },
  },

  // Input sizes
  input: {
    small: {
      height: 36,
      paddingHorizontal: SPACING.md,
      fontSize: TYPOGRAPHY.fontSize.sm,
    },
    medium: {
      height: 44,
      paddingHorizontal: SPACING.lg,
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    large: {
      height: 56,
      paddingHorizontal: SPACING.xl,
      fontSize: TYPOGRAPHY.fontSize.lg,
    },
  },

  // Icon sizes
  icon: {
    xs: 12,
    sm: 16,
    base: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
  },
} as const;

// Z-Index System
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// Layout Constants
export const LAYOUT = {
  // Screen padding
  screenPadding: SPACING.xl,
  screenPaddingHorizontal: SPACING.xl,
  screenPaddingVertical: SPACING['2xl'],

  // Container max widths
  containerMaxWidth: 480,

  // Header heights
  headerHeight: 56,
  headerHeightLarge: 64,

  // Tab bar height
  tabBarHeight: 60,

  // Safe area padding
  safeAreaTop: 44,
  safeAreaBottom: 34,
} as const;

// Animation Constants (re-exported for convenience)
export {
  ANIMATION_TIMINGS,
  ANIMATION_EASINGS,
  ANIMATION_CONFIGS,
} from './animations';

// Utility Functions
export const getResponsiveValue = <T>(
  values: { sm?: T; md?: T; lg?: T; xl?: T },
  screenWidth: number,
  defaultValue: T,
): T => {
  if (screenWidth >= BREAKPOINTS.xl && values.xl !== undefined)
    return values.xl;
  if (screenWidth >= BREAKPOINTS.lg && values.lg !== undefined)
    return values.lg;
  if (screenWidth >= BREAKPOINTS.md && values.md !== undefined)
    return values.md;
  if (screenWidth >= BREAKPOINTS.sm && values.sm !== undefined)
    return values.sm;
  return defaultValue;
};

export const getComponentSize = <T extends keyof typeof COMPONENT_SIZES>(
  component: T,
  size: keyof (typeof COMPONENT_SIZES)[T],
) => {
  return COMPONENT_SIZES[component][size];
};
