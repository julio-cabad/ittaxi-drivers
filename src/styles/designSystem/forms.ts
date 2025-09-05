import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants/modernDesignSystem';
import { itPrimary, itRed, itGreen } from '../../utils/colors';

export type FormVariant = 'default' | 'auth' | 'onboarding' | 'modern';
export type FormSize = 'small' | 'medium' | 'large';
export type FormState = 'default' | 'focus' | 'error' | 'success' | 'disabled';

interface FormStyles {
  container: ViewStyle;
  input: TextStyle;
  label: TextStyle;
  errorText: TextStyle;
  helperText: TextStyle;
}

// Base form styles
const baseContainer: ViewStyle = {
  marginBottom: SPACING.md,
};

const baseInput: TextStyle = {
  borderWidth: 1,
  paddingHorizontal: SPACING.md,
  paddingVertical: SPACING.sm + 4, // 12px like medium size
  borderRadius: BORDER_RADIUS.md,
  fontSize: TYPOGRAPHY.fontSize.md,
  color: '#000000',
};

const baseLabel: TextStyle = {
  fontSize: TYPOGRAPHY.fontSize.sm,
  fontWeight: TYPOGRAPHY.fontWeight.medium,
  marginBottom: SPACING.xs,
  color: '#374151',
};

const baseErrorText: TextStyle = {
  fontSize: TYPOGRAPHY.fontSize.xs,
  color: itRed,
  marginTop: SPACING.xs,
  fontWeight: TYPOGRAPHY.fontWeight.medium,
};

const baseHelperText: TextStyle = {
  fontSize: TYPOGRAPHY.fontSize.xs,
  color: '#6B7280',
  marginTop: SPACING.xs,
};

// Size variants
const sizes: Record<FormSize, Partial<TextStyle>> = {
  small: {
    height: 40,
    paddingHorizontal: SPACING.sm + 4, // 12px
    paddingVertical: SPACING.sm,
  },
  medium: {
    height: 50, // Matches the current form fields
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4, // 12px
  },
  large: {
    height: 60,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
};

// Variant styles
const variants: Record<FormVariant, FormStyles> = {
  default: {
    container: baseContainer,
    input: {
      ...baseInput,
      backgroundColor: '#FFFFFF',
      borderColor: '#D1D5DB',
    },
    label: baseLabel,
    errorText: baseErrorText,
    helperText: baseHelperText,
  },
  auth: {
    container: {
      ...baseContainer,
      marginBottom: SPACING.sm,
    },
    input: {
      ...baseInput,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: BORDER_RADIUS.md,
      ...SHADOWS.sm,
    },
    label: {
      ...baseLabel,
      color: '#1F2937',
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
    },
    errorText: baseErrorText,
    helperText: baseHelperText,
  },
  onboarding: {
    container: {
      ...baseContainer,
      marginBottom: SPACING.md + 4, // 20px
    },
    input: {
      ...baseInput,
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      borderRadius: BORDER_RADIUS.lg,
      ...SHADOWS.sm,
    },
    label: {
      ...baseLabel,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: '#111827',
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
    },
    errorText: baseErrorText,
    helperText: baseHelperText,
  },
  modern: {
    container: {
      ...baseContainer,
      marginBottom: SPACING.lg,
    },
    input: {
      ...baseInput,
      backgroundColor: COLORS.background.glass,
      borderColor: COLORS.border.main,
      borderRadius: BORDER_RADIUS.xl,
      color: COLORS.text.primary,
    },
    label: {
      ...baseLabel,
      color: COLORS.text.secondary,
      fontSize: TYPOGRAPHY.fontSize.sm,
    },
    errorText: {
      ...baseErrorText,
      color: COLORS.semantic.error,
    },
    helperText: {
      ...baseHelperText,
      color: COLORS.text.tertiary,
    },
  },
};

// State modifiers for inputs
const stateModifiers: Record<FormState, Partial<TextStyle>> = {
  default: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  focus: {
    borderColor: itPrimary,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    ...SHADOWS.sm,
  },
  error: {
    borderColor: itRed,
    borderWidth: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  success: {
    borderColor: itGreen,
    borderWidth: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  disabled: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
};

// Generate form style functions
export const getFormContainerStyle = (
  variant: FormVariant = 'default',
  customStyles?: ViewStyle
): ViewStyle => {
  return StyleSheet.flatten([
    variants[variant].container,
    customStyles,
  ]);
};

export const getFormInputStyle = (
  variant: FormVariant = 'default',
  size: FormSize = 'medium',
  state: FormState = 'default',
  customStyles?: TextStyle
): TextStyle => {
  return StyleSheet.flatten([
    variants[variant].input,
    sizes[size],
    stateModifiers[state],
    customStyles,
  ]);
};

export const getFormLabelStyle = (
  variant: FormVariant = 'default',
  customStyles?: TextStyle
): TextStyle => {
  return StyleSheet.flatten([
    variants[variant].label,
    customStyles,
  ]);
};

export const getFormErrorStyle = (
  variant: FormVariant = 'default',
  customStyles?: TextStyle
): TextStyle => {
  return StyleSheet.flatten([
    variants[variant].errorText,
    customStyles,
  ]);
};

export const getFormHelperStyle = (
  variant: FormVariant = 'default',
  customStyles?: TextStyle
): TextStyle => {
  return StyleSheet.flatten([
    variants[variant].helperText,
    customStyles,
  ]);
};

// Pre-built form styles
export const formStyles = StyleSheet.create({
  // Auth form styles
  authContainer: getFormContainerStyle('auth'),
  authInput: getFormInputStyle('auth', 'medium'),
  authInputFocus: getFormInputStyle('auth', 'medium', 'focus'),
  authInputError: getFormInputStyle('auth', 'medium', 'error'),
  authLabel: getFormLabelStyle('auth'),

  // Onboarding form styles
  onboardingContainer: getFormContainerStyle('onboarding'),
  onboardingInput: getFormInputStyle('onboarding', 'medium'),
  onboardingInputFocus: getFormInputStyle('onboarding', 'medium', 'focus'),
  onboardingInputError: getFormInputStyle('onboarding', 'medium', 'error'),
  onboardingLabel: getFormLabelStyle('onboarding'),

  // Modern form styles
  modernContainer: getFormContainerStyle('modern'),
  modernInput: getFormInputStyle('modern', 'medium'),
  modernInputFocus: getFormInputStyle('modern', 'medium', 'focus'),
  modernInputError: getFormInputStyle('modern', 'medium', 'error'),
  modernLabel: getFormLabelStyle('modern'),

  // Size variations
  smallInput: getFormInputStyle('default', 'small'),
  mediumInput: getFormInputStyle('default', 'medium'),
  largeInput: getFormInputStyle('default', 'large'),

  // State variations
  inputDefault: getFormInputStyle('default', 'medium', 'default'),
  inputFocus: getFormInputStyle('default', 'medium', 'focus'),
  inputError: getFormInputStyle('default', 'medium', 'error'),
  inputSuccess: getFormInputStyle('default', 'medium', 'success'),
  inputDisabled: getFormInputStyle('default', 'medium', 'disabled'),
});

export const formTextStyles = StyleSheet.create({
  // Labels
  authLabel: getFormLabelStyle('auth'),
  onboardingLabel: getFormLabelStyle('onboarding'),
  modernLabel: getFormLabelStyle('modern'),
  defaultLabel: getFormLabelStyle('default'),

  // Error texts
  authError: getFormErrorStyle('auth'),
  onboardingError: getFormErrorStyle('onboarding'),
  modernError: getFormErrorStyle('modern'),
  defaultError: getFormErrorStyle('default'),

  // Helper texts
  authHelper: getFormHelperStyle('auth'),
  onboardingHelper: getFormHelperStyle('onboarding'),
  modernHelper: getFormHelperStyle('modern'),
  defaultHelper: getFormHelperStyle('default'),
});

// Form layout styles
export const formLayouts = StyleSheet.create({
  // Form wrappers
  authFormWrapper: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
  },
  onboardingFormWrapper: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  modernFormWrapper: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
  },

  // Field groups
  fieldGroup: {
    marginBottom: SPACING.lg,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  fieldColumn: {
    flex: 1,
  },

  // Form sections
  formSection: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: '#111827',
    marginBottom: SPACING.md,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: SPACING.lg,
  },
});