import { StyleSheet } from 'react-native';
import { itPrimary } from '../../utils/colors';

// Legacy onboarding styles (only keeping what's actively used)
export const onboardingStyles = StyleSheet.create({
  // Background Gradient - Used in PersonalDataScreen, VehicleDataScreen, DocumentsUploadScreen
  gradientBackground: {
    flex: 1,
    backgroundColor: itPrimary,
  },

  // Form Card - Used in PersonalDataScreen, VehicleDataScreen, DocumentsUploadScreen, RegisterScreen
  formCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },

  // Logo Container - Used in PersonalDataScreen, VehicleDataScreen, DocumentsUploadScreen, RegisterScreen
  logoContainer: {
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Logo - Used in PersonalDataScreen, VehicleDataScreen, RegisterScreen
  logo: {
    width: 180,
    height: 100,
  },

  // Form Subtitle - Used in PersonalDataScreen, VehicleDataScreen, RegisterScreen
  formSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
});
