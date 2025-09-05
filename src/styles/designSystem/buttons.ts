import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { SHADOWS, BORDER_RADIUS, SPACING, TYPOGRAPHY, BUTTON_STATES } from '../../constants/modernDesignSystem';
import { itPrimary, itSecondary, itPurple, itRed, itGreen } from '../../utils/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'purple';
export type ButtonSize = 'small' | 'medium' | 'large' | 'xl';
export type ButtonState = 'default' | 'pressed' | 'disabled' | 'loading';

interface ButtonStyles {
  container: ViewStyle;
  text: TextStyle;
}

// Base button styles
const baseButton: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: BORDER_RADIUS.full,
  flexDirection: 'row',
};

const baseText: TextStyle = {
  fontWeight: TYPOGRAPHY.fontWeight.semibold,
  textAlign: 'center',
};

// Size variants
const sizes: Record<ButtonSize, ButtonStyles> = {
  small: {
    container: {
      height: 36,
      paddingHorizontal: SPACING.md,
      minWidth: 100,
    },
    text: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.tight,
    },
  },
  medium: {
    container: {
      height: 48,
      paddingHorizontal: SPACING.lg,
      minWidth: 120,
    },
    text: {
      fontSize: TYPOGRAPHY.fontSize.md,
      lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.tight,
    },
  },
  large: {
    container: {
      height: 56,
      paddingHorizontal: SPACING.xl,
      minWidth: 140,
    },
    text: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.tight,
    },
  },
  xl: {
    container: {
      height: 64,
      paddingHorizontal: SPACING.xxl,
      minWidth: 160,
    },
    text: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      lineHeight: TYPOGRAPHY.fontSize.xl * TYPOGRAPHY.lineHeight.tight,
    },
  },
};

// Variant styles
const variants: Record<ButtonVariant, ButtonStyles> = {
  primary: {
    container: {
      backgroundColor: itPrimary,
      ...SHADOWS.md,
      shadowColor: itPrimary,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  secondary: {
    container: {
      backgroundColor: itSecondary,
      ...SHADOWS.md,
      shadowColor: itSecondary,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  purple: {
    container: {
      backgroundColor: itPurple,
      ...SHADOWS.md,
      shadowColor: itPurple,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: itPrimary,
    },
    text: {
      color: itPrimary,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: itPrimary,
    },
  },
  danger: {
    container: {
      backgroundColor: itRed,
      ...SHADOWS.md,
      shadowColor: itRed,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  success: {
    container: {
      backgroundColor: itGreen,
      ...SHADOWS.md,
      shadowColor: itGreen,
    },
    text: {
      color: '#FFFFFF',
    },
  },
};

// State modifiers
const stateModifiers: Record<ButtonState, Partial<ViewStyle>> = {
  default: {
    opacity: BUTTON_STATES.default.opacity,
    transform: [{ scale: BUTTON_STATES.default.scale }],
  },
  pressed: {
    opacity: BUTTON_STATES.pressed.opacity,
    transform: [{ scale: BUTTON_STATES.pressed.scale }],
  },
  disabled: {
    opacity: BUTTON_STATES.disabled.opacity,
    transform: [{ scale: BUTTON_STATES.disabled.scale }],
  },
  loading: {
    opacity: BUTTON_STATES.loading.opacity,
    transform: [{ scale: BUTTON_STATES.loading.scale }],
  },
};

// Generate button style function
export const getButtonStyle = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'medium',
  state: ButtonState = 'default',
  customStyles?: ViewStyle
): ViewStyle => {
  return StyleSheet.flatten([
    baseButton,
    sizes[size].container,
    variants[variant].container,
    stateModifiers[state],
    customStyles,
  ]);
};

// Generate text style function
export const getButtonTextStyle = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'medium',
  customStyles?: TextStyle
): TextStyle => {
  return StyleSheet.flatten([
    baseText,
    sizes[size].text,
    variants[variant].text,
    customStyles,
  ]);
};

// Pre-built styles for common use cases
export const buttonStyles = StyleSheet.create({
  // Auth form buttons
  authSubmit: getButtonStyle('purple', 'medium', 'default', {
    marginTop: SPACING.md + 2, // 18 like original
    borderRadius: 30, // Custom rounded for auth
  }),
  authOutline: getButtonStyle('outline', 'medium'),
  authGhost: getButtonStyle('ghost', 'medium'),

  // Onboarding buttons
  onboardingPrimary: getButtonStyle('primary', 'large'),
  onboardingSecondary: getButtonStyle('secondary', 'medium'),
  onboardingNext: getButtonStyle('primary', 'medium', 'default', {
    marginTop: SPACING.lg,
  }),

  // Form buttons
  formSubmit: getButtonStyle('primary', 'medium', 'default', {
    marginTop: SPACING.lg,
    width: '100%',
  }),
  formCancel: getButtonStyle('ghost', 'medium'),
  formDanger: getButtonStyle('danger', 'medium'),

  // Utility buttons
  small: getButtonStyle('primary', 'small'),
  medium: getButtonStyle('primary', 'medium'),
  large: getButtonStyle('primary', 'large'),
  xl: getButtonStyle('primary', 'xl'),
});

export const buttonTextStyles = StyleSheet.create({
  // Auth form text
  authSubmit: getButtonTextStyle('purple', 'medium'),
  authOutline: getButtonTextStyle('outline', 'medium'),
  authGhost: getButtonTextStyle('ghost', 'medium'),

  // Onboarding text
  onboardingPrimary: getButtonTextStyle('primary', 'large'),
  onboardingSecondary: getButtonTextStyle('secondary', 'medium'),
  onboardingNext: getButtonTextStyle('primary', 'medium'),

  // Form text
  formSubmit: getButtonTextStyle('primary', 'medium'),
  formCancel: getButtonTextStyle('ghost', 'medium'),
  formDanger: getButtonTextStyle('danger', 'medium'),

  // Utility text
  small: getButtonTextStyle('primary', 'small'),
  medium: getButtonTextStyle('primary', 'medium'),
  large: getButtonTextStyle('primary', 'large'),
  xl: getButtonTextStyle('primary', 'xl'),
});

// Legacy compatibility - keeping the exact same style as LoginForm.styles.ts
export const legacyStyles = StyleSheet.create({
  submitButton: {
    marginTop: 18,
    backgroundColor: itPurple,
    borderRadius: 30,
    height: 48,
    shadowColor: itPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 1,
  },
});
