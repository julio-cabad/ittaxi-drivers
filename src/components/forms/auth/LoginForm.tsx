import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../commons';
import { ModernInput } from '../../modern';
import { LoginFormContentProps } from '../../../types/auth';
import { strings } from '../../../constants/strings';
import tw from 'twrnc';
import { itPrimary } from '../../../utils';

const LoginFormContent: React.FC<LoginFormContentProps> = ({
  formik,
  onSubmit,
  loading = false,
}) => {
  const handleSubmit = async () => {
    // Marcar todos los campos como touched para mostrar errores
    formik.setTouched({
      email: true,
      password: true,
    });

    // Validar el formulario
    const errors = await formik.validateForm();
    
    // Si hay errores, no continuar
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Si todo está válido, proceder con el submit
    if (formik.isValid && !formik.isSubmitting) {
      await onSubmit(formik.values);
    }
  };

  return (
    <View style={tw`w-full`}>
      {/* Email Input */}
      <ModernInput
        name="email"
        label={strings.auth.login.emailLabel}
        placeholder={strings.auth.login.emailPlaceholder}
        variant="default"
        size="medium"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        leftIcon={<Icon name="email" size={20} color={itPrimary} />}
        showSuccessIndicator={true}
        animationDelay={100}
        testID="login-email-input"
      />

      {/* Password Input */}
      <ModernInput
        name="password"
        label={strings.auth.login.passwordLabel}
        placeholder={strings.auth.login.passwordPlaceholder}
        variant="default"
        size="medium"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        leftIcon={<Icon name="lock" size={20} color={itPrimary} />}
        showSuccessIndicator={true}
        animationDelay={200}
        testID="login-password-input"
      />

      {/* Submit Button - MODERNIZED */}
      <Button
        variant="primary"
        size="large"
        loading={loading}
        disabled={!formik.isValid || formik.isSubmitting || loading}
        onPress={handleSubmit}
        style={[
          tw`mt-8`,
          {
            backgroundColor: '#667eea',
            borderRadius: 16,
            height: 56,
            shadowColor: '#667eea',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }
        ]}
        testID="login-submit-button"
      >
        {loading
          ? strings.auth.login.submitButtonLoading
          : strings.auth.login.submitButton}
      </Button>
    </View>
  );
};

export default LoginFormContent;
