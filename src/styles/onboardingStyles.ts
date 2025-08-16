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

  // Form Card - Diseño moderno mejorado
  formCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32, // Más espaciado superior
    paddingBottom: 20,
    // Enhanced shadow system
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },

  // Logo with modern effects
  logoContainer: {
    marginBottom: 8,
    alignItems: 'center',
    // Subtle glow effect
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
