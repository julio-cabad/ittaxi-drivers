import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  KeyboardTypeOptions,
  StyleProp,
  TextStyle,
  // Removed NativeSyntheticEvent and TextInputFocusEventData as they are deprecated/not needed
} from 'react-native';
import { useField } from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { inputStyles } from '../../styles';

// Import FocusEvent and BlurEvent directly
import { FocusEvent, BlurEvent } from 'react-native';

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'username' | 'password' | 'email' | 'name';
  testID?: string;
  // Updated types for onFocus and onBlur to use FocusEvent and BlurEvent
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: BlurEvent) => void;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder,
  secureTextEntry = false,
  disabled = false,
  leftIcon,
  rightIcon,
  containerStyle,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  testID,
  onFocus,
  onBlur,
  maxLength,
}) => {
  const [field, meta, helpers] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // handleFocus now receives FocusEvent
  const handleFocus = (e: FocusEvent) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // handleBlur now receives BlurEvent
  const handleBlur = (e: BlurEvent) => {
    setIsFocused(false);
    helpers.setTouched(true);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const hasError = meta.touched && meta.error;

  return (
    <View style={[inputStyles.container, containerStyle]}>
      {label && <Text style={inputStyles.label}>{label}</Text>}

      <View
        style={[
          inputStyles.base,
          isFocused && inputStyles.focused,
          hasError && inputStyles.error,
          disabled && { opacity: 0.5, backgroundColor: '#f3f4f6' },
        ]}
      >
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}

        <TextInput
          style={inputStyles.textInput as StyleProp<TextStyle>}
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
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ marginLeft: 8 }}
            testID={`${testID}-password-toggle`}
          >
            <Icon
              name={isPasswordVisible ? 'visibility-off' : 'visibility'}
              size={22}
              color="#6b7280"
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={{ marginLeft: 8 }}>{rightIcon}</View>
        )}
      </View>

      {hasError && (
        <Text style={inputStyles.errorMessage} testID={`${testID}-error`}>
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export default Input;
