import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button } from '../../commons';
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
      <Input
        name="email"
        label={strings.auth.login.emailLabel}
        placeholder={strings.auth.login.emailPlaceholder}
        keyboardType="email-address"
        autoCapitalize="none"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        autoComplete="email"
        leftIcon={<Icon name="email" size={20} color={itPrimary} />}
        testID="login-email-input"
      />

      {/* Password Input */}
      <Input
        name="password"
        label={strings.auth.login.passwordLabel}
        placeholder={strings.auth.login.passwordPlaceholder}
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        labelStyle={tw`text-gray-600 text-sm`}
        errorStyle={tw`text-xs text-red-500`}
        leftIcon={<Icon name="lock" size={20} color={itPrimary} />}
        testID="login-password-input"
      />

      {/* Submit Button */}
      <Button
        variant="primary"
        size="large"
        loading={loading}
        disabled={!formik.isValid || formik.isSubmitting || loading}
        onPress={handleSubmit}
        style={tw`mt-8`}
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
