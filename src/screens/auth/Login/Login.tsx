import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../../navigation/AuthNavigator';
import { SCREEN_NAMES, strings } from '../../../constants';
import { AuthScreenWrapper } from '../../../components/layout';
import { FormWrapper, LoginFormContent } from '../../../components/forms';
import { AuthSchemas, InitialValues } from '../../../utils/validationSchemas';
import { useAuth, useOnboarding } from '../../../hooks';
import { LoginFormData } from '../../../types/auth';
import { loginStyles, complexLoginStyles } from './Login.styles';
import tw from 'twrnc';
import TextLink from '../../../components/commons/TextLink';
import { itPurple } from '../../../utils/colors';

const Login = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { login, isLoggingIn, isAuthenticated, user } = useAuth();
  const { recoverProgress, loadUserData } = useOnboarding();
  const [isCheckingProgress, setIsCheckingProgress] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || hasChecked) {
      return;
    }
    const checkAndNavigateToProgress = async () => {
      try {
        setIsCheckingProgress(true);
        setHasChecked(true);
        const recovery = await recoverProgress();
        if (recovery.shouldNavigate && recovery.targetScreen) {
          await loadUserData();
          setTimeout(() => {
            navigation.navigate(recovery.targetScreen as never);
          }, 100);
        }
      } catch (error) {
        console.log('❌ Error en recuperación de progreso:', error);
      } finally {
        setIsCheckingProgress(false);
      }
    };
    checkAndNavigateToProgress();
  }, [hasChecked, isAuthenticated, loadUserData, navigation, recoverProgress, user]);

  const handleLogin = async (values: LoginFormData) => {
    await login(values);
  };

  if (isAuthenticated && isCheckingProgress) {
    return (
      <View style={loginStyles.progressLoadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={loginStyles.progressLoadingText}>
          Recuperando progreso...
        </Text>
      </View>
    );
  }

  return (
    <AuthScreenWrapper>
      <View style={loginStyles.headerSection}>
        <View style={loginStyles.welcomeTextContainer}>
          <Text style={complexLoginStyles.welcomeTitle}>
            {strings.auth.login.title}
          </Text>
        </View>
      </View>

      <View
        style={[
          loginStyles.formCard,
          complexLoginStyles.formCard,
          { minHeight: 500 },
        ]}
      >
        <View style={complexLoginStyles.logoContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={complexLoginStyles.logo}
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
            <View style={tw`flex-1 mt-2`}>
              <LoginFormContent
                formik={formik}
                onSubmit={handleLogin}
                loading={isLoggingIn}
              />

              <TextLink
                onPress={() =>
                  navigation.navigate(SCREEN_NAMES.AUTH.FORGOT_PASSWORD)
                }
                style={loginStyles.forgotPasswordButton}
                color={itPurple}
                fontSize={14}
                fontWeight="600"
              >
                {strings.auth.login.forgotPassword}
              </TextLink>

              <View
                style={[
                  loginStyles.footerLinks,
                  { marginTop: 'auto', paddingTop: 20 },
                ]}
              >
                <View style={loginStyles.loginContainer}>
                  <Text style={loginStyles.alreadyAccountText}>
                    {strings.auth.login.noAccount}
                  </Text>
                  <TextLink
                    onPress={() =>
                      navigation.navigate(SCREEN_NAMES.ONBOARDING.REGISTER)
                    }
                    color={itPurple}
                    fontSize={14}
                    fontWeight="bold"
                    style={{ marginLeft: 4 }}
                  >
                    {strings.auth.login.signUp}
                  </TextLink>
                </View>
              </View>
            </View>
          )}
        </FormWrapper>
      </View>
    </AuthScreenWrapper>
  );
};

export default Login;
