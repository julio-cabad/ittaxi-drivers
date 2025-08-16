import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES, strings } from '../../constants';
import { ScreenWrapper } from '../../components/layout';
import { FormWrapper, LoginFormContent } from '../../components/forms';
import { AuthSchemas, InitialValues } from '../../utils/validationSchemas';
import { useAuth, useOnboarding } from '../../hooks';
import { LoginFormData } from '../../types/auth';
import { itPrimary } from '../../utils/colors';
import { onboardingStyles } from '../../styles/onboardingStyles';

const Login = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { login, isLoggingIn, isAuthenticated, user } = useAuth();
  const { recoverProgress } = useOnboarding();
  const [isCheckingProgress, setIsCheckingProgress] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // 🎯 Recuperación automática de progreso - REACTIVADO DE FORMA SEGURA
  useEffect(() => {
    if (!isAuthenticated || !user || hasChecked) {
      return;
    }

    const checkAndNavigateToProgress = async () => {
      try {
        setIsCheckingProgress(true);
        setHasChecked(true); // Marcar inmediatamente para evitar múltiples ejecuciones
        
        const recovery = await recoverProgress();
        
        console.log('🔍 Recovery result:', recovery);
        
        if (recovery.shouldNavigate && recovery.targetScreen) {
          console.log(`✅ Navegando a: ${recovery.targetScreen} (Step ${recovery.currentStep})`);
          // Pequeño delay para asegurar que la navegación esté lista
          setTimeout(() => {
            navigation.navigate(recovery.targetScreen as never);
          }, 100);
        } else {
          console.log('ℹ️ No hay progreso guardado, permaneciendo en login');
        }
      } catch (error) {
        console.log('❌ Error en recuperación de progreso:', error);
      } finally {
        setIsCheckingProgress(false);
      }
    };

    checkAndNavigateToProgress();
  }, [isAuthenticated, user]); // Solo depende de autenticación

  const handleLogin = async (values: LoginFormData) => {
    await login(values);
    // El useEffect de arriba se encarga de la navegación automática
    // El errorInterceptor maneja los errores automáticamente
  };

  // Mostrar loading si está verificando progreso
  if (isAuthenticated && isCheckingProgress) {
    return (
      <View style={onboardingStyles.progressLoadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={onboardingStyles.progressLoadingText}>Recuperando progreso...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      {/* Enhanced Background Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={onboardingStyles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header Section */}
        <View style={onboardingStyles.headerSection}>
          <View style={onboardingStyles.welcomeTextContainer}>
            <Text style={onboardingStyles.welcomeTitle}>
              {strings.auth.login.title}
            </Text>
          </View>
        </View>

        {/* Form Card - 80% of screen */}
        <View style={onboardingStyles.formCard}>
          {/* Logo inside white card */}
          <View style={onboardingStyles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={onboardingStyles.logo}
              resizeMode="contain"
            />
          </View>
          <FormWrapper
            initialValues={InitialValues.login}
            validationSchema={AuthSchemas.login}
            onSubmit={handleLogin}
            scrollEnabled={false}
          >
            {formik => (
              <View>
                <LoginFormContent
                  formik={formik}
                  onSubmit={handleLogin}
                  loading={isLoggingIn}
                />
 
                {/* Forgot Password - Inside form, after button */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(SCREEN_NAMES.AUTH.FORGOT_PASSWORD)
                  }
                  style={onboardingStyles.forgotPasswordButton}
                >
                  <Text style={onboardingStyles.forgotPasswordText}>
                    {strings.auth.login.forgotPassword}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </FormWrapper>

          {/* Footer Links - Only Register Link */}
          <View style={onboardingStyles.footerLinks}>
            <View style={onboardingStyles.loginContainer}>
              <Text style={onboardingStyles.alreadyAccountText}>
                {strings.auth.login.noAccount}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(SCREEN_NAMES.ONBOARDING.REGISTER)
                }
              >
                <Text style={onboardingStyles.loginText}>
                  {strings.auth.login.signUp}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Error Display removido - errorInterceptor maneja los errores automáticamente */}
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

// Estilos eliminados - ahora usa onboardingStyles centralizados

export default Login;
