import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES } from '../../constants';
import { ScreenWrapper } from '../../components/layout';
import { FormWrapper, RegisterFormContent } from '../../components/forms';
import { AuthSchemas, InitialValues } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks';
import { RegisterFormData } from '../../types/auth';
import { itPrimary } from '../../utils/colors';
import { onboardingStyles } from '../../styles/onboardingStyles';

const RegisterScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const {
    register,
    isRegistering,
    clearAuthError,
  } = useAuth();

  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleRegister = async (values: RegisterFormData) => {
    const result = await register(values);
    const { success } = result || {};
    // Solo navegar si es exitoso - los errores ya los maneja el errorInterceptor
    if (success) {
      navigation.navigate(SCREEN_NAMES.ONBOARDING.PERSONAL_DATA);
    }
    // No necesitamos manejar errores aquí - el errorInterceptor ya los maneja
  };

  return (
    <ScreenWrapper>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1c3a69', '#2563eb', '#1e40af']}
        style={onboardingStyles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header Section */}
        <View style={onboardingStyles.headerSection}>
          <View style={onboardingStyles.welcomeTextContainer}>
            <Text style={onboardingStyles.welcomeTitle}>Bienvenido</Text>
            <Text style={onboardingStyles.welcomeSubtitle}>¡Crea tu cuenta!</Text>
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
            initialValues={InitialValues.register}
            validationSchema={AuthSchemas.register}
            onSubmit={handleRegister}
            scrollEnabled={false}
          >
            {formik => (
              <RegisterFormContent
                formik={formik}
                onSubmit={handleRegister}
              />
            )}
          </FormWrapper>

          {/* Footer Links - Only Login Link */}
          <View style={onboardingStyles.footerLinks}>
            <View style={onboardingStyles.loginContainer}>
              <Text style={onboardingStyles.alreadyAccountText}>
                ¿Ya tienes una cuenta?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(SCREEN_NAMES.AUTH.LOGIN)}
              >
                <Text style={onboardingStyles.loginText}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};



export default RegisterScreen;
