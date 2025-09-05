import { StyleSheet } from 'react-native';
import { buttonStyles, formStyles, formLayouts, SPACING, BORDER_RADIUS, SHADOWS } from '../designSystem';
import { itPurple } from '../../utils/colors';

export const authStyles = StyleSheet.create({
  // Screen containers
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
  },
  
  // Form containers
  formContainer: {
    ...formLayouts.authFormWrapper,
    marginTop: SPACING.xxl,
  },
  
  // Auth-specific buttons
  loginButton: {
    ...buttonStyles.authSubmit,
  },
  
  registerButton: {
    ...buttonStyles.authSubmit,
  },
  
  forgotPasswordButton: {
    ...buttonStyles.authSubmit,
  },
  
  // Secondary actions
  linkButton: {
    ...buttonStyles.authGhost,
    marginTop: SPACING.md,
  },
  
  // Auth form inputs (specific overrides)
  emailInput: {
    ...formStyles.authInput,
  },
  
  passwordInput: {
    ...formStyles.authInput,
  },
  
  confirmPasswordInput: {
    ...formStyles.authInput,
  },
  
  // Logo and branding
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: itPurple,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  taglineText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Header sections
  headerContainer: {
    marginBottom: SPACING.xxl,
    alignItems: 'center',
  },
  
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Footer sections
  footerContainer: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  footerLink: {
    fontSize: 14,
    color: itPurple,
    fontWeight: '600',
  },
  
  // Special auth backgrounds
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  glassmorphicCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

// Text styles for auth components
export const authTextStyles = StyleSheet.create({
  // Form labels
  label: formStyles.authLabel,
  
  // Button texts
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: itPurple,
  },
  
  // Status texts
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: SPACING.xs,
  },
  
  successText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: SPACING.xs,
  },
  
  // Helper texts
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: SPACING.xs,
    lineHeight: 16,
  },
});
