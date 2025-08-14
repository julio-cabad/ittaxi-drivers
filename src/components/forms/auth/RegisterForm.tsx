import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button } from '../../commons';
import { RegisterFormContentProps } from '../../../types/auth';
import tw from 'twrnc';
import { itPrimary } from '../../../utils';

const RegisterFormContent: React.FC<RegisterFormContentProps> = ({
  formik,
  onSubmit,
}) => {
  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <View style={tw`w-full`}>
      {/* Email Input */}
      <Input
        name="email"
        label="Correo electrónico"
        placeholder="correo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        autoComplete="email"
        leftIcon={<Icon name="email" size={20} color={itPrimary} />}
        testID="register-email-input"
      />

      {/* Password Input */}
      <Input
        name="password"
        label="Contraseña"
        placeholder="Ingresa tu contraseña"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        labelStyle={tw`text-gray-600 text-sm`}
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        leftIcon={<Icon name="lock" size={20} color={itPrimary} />}
        testID="register-password-input"
      />

      {/* Confirm Password Input */}
      <Input
        name="confirmPassword"
        label="Confirmar contraseña"
        placeholder="Confirma tu contraseña"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        labelStyle={tw`text-gray-600 text-sm`}
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        leftIcon={<Icon name="lock-outline" size={20} color={itPrimary} />}
        testID="register-confirm-password-input"
      />

      {/* Submit Button */}
      <Button
        variant="primary"
        size="large"
        loading={formik.isSubmitting}
        disabled={!formik.isValid || formik.isSubmitting}
        onPress={handleSubmit}
        style={tw`mt-8`}
        testID="register-submit-button"
      >
        {formik.isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </View>
  );
};

export default RegisterFormContent;
