import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES, strings } from '../../constants';
import { AuthScreenWrapper } from '../../components/layout';
import { FormWrapper, RegisterFormContent } from '../../components/forms';
import { AuthSchemas, InitialValues } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks';
import { RegisterFormData } from '../../types/auth';
import { onboardingStyles } from '../../styles/components/onboarding';
import { complexLoginStyles, loginStyles } from '../auth/Login/Login.styles';
import TextLink from '../../components/commons/TextLink';
import { itPurple } from '../../utils/colors';

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
    if (success) {
      navigation.navigate(SCREEN_NAMES.ONBOARDING.PERSONAL_DATA);
    }
  };

  return (
    <AuthScreenWrapper>
      <View style={loginStyles.headerSection}>
        <View style={loginStyles.welcomeTextContainer}>
          <Text style={complexLoginStyles.welcomeTitle}>Crea tu cuenta</Text>
        </View>
      </View>

      <View style={[loginStyles.formCard, complexLoginStyles.formCard, { minHeight: 500 }]}>
        <View style={complexLoginStyles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={complexLoginStyles.logo}
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
              loading={isRegistering}
            />
          )}
        </FormWrapper>

        <View style={[loginStyles.footerLinks, { marginTop: 'auto', paddingTop: 20 }]}>
          <View style={loginStyles.loginContainer}>
            <Text style={loginStyles.alreadyAccountText}>
              ¿Ya tienes una cuenta?
            </Text>
            <TextLink
              onPress={() => navigation.navigate(SCREEN_NAMES.AUTH.LOGIN)}
              color={itPurple}
              fontSize={14}
              fontWeight="bold"
              style={{ marginLeft: 4 }}
            >
              Iniciar sesión
            </TextLink>
          </View>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default RegisterScreen;
