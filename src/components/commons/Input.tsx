import React, { useState } from 'react';
import { TextInput, Text, View, TouchableOpacity, ViewStyle, TextStyle, KeyboardTypeOptions } from 'react-native';
import { useField } from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'twrnc';

export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputSize = 'small' | 'medium' | 'large';

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'username' | 'password' | 'email' | 'name' | 'tel' | 'street-address' | 'postal-code' | 'cc-number' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year';
  testID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder,
  secureTextEntry = false,
  variant = 'default',
  size = 'medium',
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  testID,
  onFocus,
  onBlur,
  maxLength,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getVariantStyles = () => {
    // Para confirmPassword, mostrar error inmediatamente si hay error
    // Para otros campos, esperar a que sea touched
    const isConfirmPassword = name === 'confirmPassword';
    const hasError = isConfirmPassword ? meta.error : (meta.touched && meta.error);
    const baseStyles = tw`rounded-lg`;
    
    switch (variant) {
      case 'filled':
        return [
          baseStyles,
          tw`bg-itGray border-0`,
          isFocused && tw`bg-white border-2 border-itPrimary`,
          hasError && tw`border-2 border-itRed`,
        ];
      case 'outlined':
        return [
          baseStyles,
          tw`bg-transparent border-2 border-itGray`,
          isFocused && tw`border-itPrimary`,
          hasError && tw`border-itRed`,
        ];
      default:
        return [
          baseStyles,
          tw`bg-white border border-itGray`,
          isFocused && tw`border-itPrimary`,
          hasError && tw`border-itRed`,
        ];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return tw`px-3 py-2`;
      case 'large':
        return tw`px-4 py-4`;
      default:
        return tw`px-4 py-3`;
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return tw`text-sm`;
      case 'large':
        return tw`text-lg`;
      default:
        return tw`text-base`;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    helpers.setTouched(true);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const hasError = meta.touched && meta.error;

  return (
    <View style={[style]}>
      {label && (
        <Text
          style={[
            tw`text-base mb-1 text-itDarkGray font-medium`,
            hasError && tw`text-itRed`,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      
      <View style={tw`relative`}>
        <View
          style={[
            tw`flex-row items-center`,
            ...getVariantStyles(),
            getSizeStyles(),
            disabled && tw`opacity-50 bg-gray-100`,
          ]}
        >
          {leftIcon && (
            <View style={tw`mr-3`}>
              {leftIcon}
            </View>
          )}

          <TextInput
            style={[
              tw`flex-1 text-itDarkGray`,
              getTextSizeStyles(),
              inputStyle,
            ]}
            value={field.value}
            onChangeText={helpers.setValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            editable={!disabled}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            testID={testID}
            maxLength={maxLength}
            {...props}
          />

          {secureTextEntry && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={tw`ml-3`}
              testID={`${testID}-password-toggle`}
            >
              <Icon 
                name={isPasswordVisible ? 'visibility-off' : 'visibility'} 
                size={20} 
                color="#1c3a69" 
              />
            </TouchableOpacity>
          )}

          {rightIcon && !secureTextEntry && (
            <View style={tw`ml-3`}>
              {rightIcon}
            </View>
          )}
        </View>
      </View>

      {hasError && (
        <Text
          style={[
            tw`text-red-400 text-sm`,
            errorStyle,
          ]}
          testID={`${testID}-error`}
        >
          {typeof meta.error === 'string' ? meta.error : 'Error en el campo'}
        </Text>
      )}
    </View>
  );
};

export default Input;