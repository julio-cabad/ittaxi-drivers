import { StyleSheet } from 'react-native';
import { itPrimary } from '../utils/colors';

// Estilos centralizados para todas las pantallas de onboarding
export const onboardingStyles = StyleSheet.create({
  // Background Gradient
  gradientBackground: {
    flex: 1,
    backgroundColor: itPrimary,
  },

  // Header Section - Legacy styles for screens not yet migrated
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    minHeight: 160,
  },

  // Welcome Text - Legacy styles
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'left',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'left',
    lineHeight: 24,
  },

  // Form Card - Ocupa el resto del espacio disponible
  formCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24, // Aumentado de 2 a 24 para mejor espaciado
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  // Logo
  logoContainer: {
    marginBottom: 2,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 100,
  },

  // Form Subtitle
  formSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },

  // Footer Links (para Register/Login)
  footerLinks: {
    marginTop: 'auto',
    paddingTop: 20,
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadyAccountText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginText: {
    fontSize: 16,
    color: itPrimary,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Estilos específicos para Login
  forgotPasswordButton: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#6b7280',
    fontSize: 16,
  },

  // Loading de progreso
  progressLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  progressLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});
