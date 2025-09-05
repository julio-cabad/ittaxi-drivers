import React from 'react';
import { Keyboard, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../commons';
import { FormField } from '../../commons/FormField';
import { RegisterFormContentProps } from '../../../types/auth';
import { strings } from '../../../constants';
import tw from 'twrnc';
import { itPrimary } from '../../../utils';
import { authStyles } from '../../../styles/components/auth';

const RegisterFormContent: React.FC<RegisterFormContentProps> = ({
  formik,
  onSubmit,
  loading = false,
}) => {
  const handleSubmit = async () => {
    Keyboard.dismiss();
    formik.setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (formik.isValid && !formik.isSubmitting) {
      await onSubmit(formik.values);
    }
  };

  return (
    <View style={tw`w-full`}>
      <FormField
        name="email"
        label={strings.auth.createAccount.emailLabel}
        size="medium"
        height={50}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        leftIcon={<Icon name="email" size={20} color={itPrimary} />}
        showSuccessIndicator={true}
        testID="register-email-input"
      />

      <FormField
        name="password"
        label={strings.auth.createAccount.passwordLabel}
        size="medium"
        height={50}
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        leftIcon={<Icon name="lock" size={20} color={itPrimary} />}
        showSuccessIndicator={true}
        testID="register-password-input"
        containerStyle={tw`mt-2`}
      />

      <FormField
        name="confirmPassword"
        label={strings.auth.createAccount.confirmPasswordLabel}
        size="medium"
        height={50}
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        leftIcon={<Icon name="lock-outline" size={20} color={itPrimary} />}
        showSuccessIndicator={true}
        testID="register-confirm-password-input"
        containerStyle={tw`mt-2`}
      />

      <Button
        variant="primary"
        size="medium"
        loading={loading}
        disabled={!formik.isValid || formik.isSubmitting || loading}
        onPress={handleSubmit}
        style={authStyles.registerButton}
        testID="register-submit-button"
      >
        {loading
          ? strings.auth.createAccount.submitButtonLoading
          : strings.auth.createAccount.submitButton}
      </Button>
    </View>
  );
};

export default RegisterFormContent;
