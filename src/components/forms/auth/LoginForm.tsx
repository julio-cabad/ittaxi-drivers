import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../commons';
import { FormField } from '../../commons/FormField';
import { LoginFormContentProps } from '../../../types/auth';
import { strings } from '../../../constants/strings';
import tw from 'twrnc';
import { itPrimary } from '../../../utils';
import { styles } from './LoginForm.styles';

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
      <FormField
        name="email"
        label={strings.auth.login.emailLabel}
        size="medium"
        height={50} // Altura personalizada - puedes cambiar este valor
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        leftIcon={<Icon name="email" size={20} color={itPrimary} />}
        showSuccessIndicator={true}
        testID="login-email-input"
      />

      {/* Password Input */}
      <FormField
        name="password"
        label={strings.auth.login.passwordLabel}
        size="medium"
        height={50} // Altura personalizada - puedes cambiar este valor
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        leftIcon={<Icon name="lock" size={20} color={itPrimary} />}
        showSuccessIndicator={true}
        testID="login-password-input"
        containerStyle={tw`mt-2`}
      />

      {/* Submit Button - MODERNIZED */}
      <Button
        variant="primary"
        size="medium"
        loading={loading}
        disabled={!formik.isValid || formik.isSubmitting || loading}
        onPress={handleSubmit}
        style={styles.submitButton}
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