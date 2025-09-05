import React, { useRef, useState } from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useField } from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { itPrimary, itRed } from '../../../utils/colors';
import styles from './FormField.styles';
import { FormFieldProps } from './FormField.types';

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  size = 'medium',
  height,
  secureTextEntry = false,
  disabled = false,
  leftIcon,
  rightIcon,
  showSuccessIndicator = true,
  containerStyle,
  inputStyle,
  labelStyle,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  testID,
  onFocus,
  onBlur,
  maxLength,
  blurOnSubmit = true,
}) => {
  const [field, meta, helpers] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const labelAnimation = useRef(new Animated.Value(field.value ? 1 : 0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const hasError = meta.touched && meta.error;
  const hasValue = field.value && field.value.length > 0;
  const isValid = meta.touched && !meta.error && hasValue;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.spring(scaleAnimation, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!hasValue) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    helpers.setTouched(true);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getSizeStyles = () => {
    const baseStyles = {
      small: { height: 48, paddingHorizontal: 16, fontSize: 14 },
      large: { height: 72, paddingHorizontal: 24, fontSize: 18 },
      medium: { height: 64, paddingHorizontal: 20, fontSize: 17 },
    };
    const selectedStyle = baseStyles[size] || baseStyles.medium;
    if (height) {
      return { ...selectedStyle, height };
    }
    return selectedStyle;
  };

  const sizeStyles = getSizeStyles();

  const animatedLabelStyle = {
    transform: [
      {
        translateY: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -24],
        }),
      },
      {
        scale: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85],
        }),
      },
    ],
    color: hasError ? itRed : isFocused ? itPrimary : '#6b7280',
  };

  const animatedContainerStyle = {
    transform: [{ scale: scaleAnimation }],
  };

  return (
    <Animated.View
      style={[styles.container, containerStyle, animatedContainerStyle]}
    >
      {label && (
        <Animated.Text style={[styles.label, labelStyle, animatedLabelStyle]}>
          {label}
        </Animated.Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            height: sizeStyles.height,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            borderColor: hasError ? itRed : isFocused ? itPrimary : '#d1d5db',
            shadowOpacity: isFocused ? 0.15 : 0.05,
          },
          disabled && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <View style={{ flex: 1 }}>
            <TextInput
                style={[
                    styles.textInput,
                    {
                        fontSize: sizeStyles.fontSize,
                        color: disabled ? '#9ca3af' : '#111827',
                        height: '100%',
                    },
                    inputStyle,
                ]}
                cursorColor={itPrimary}
                value={field.value}
                onChangeText={helpers.setValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={!isFocused && !hasValue ? placeholder : ''}
                placeholderTextColor="#9ca3af"
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                editable={!disabled}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoComplete={autoComplete}
                testID={testID}
                maxLength={maxLength}
                blurOnSubmit={blurOnSubmit}
            />
        </View>
        {isValid && showSuccessIndicator && (
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={20} color="#10b981" />
          </View>
        )}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.passwordToggle}
            testID={`${testID}-password-toggle`}
          >
            <Icon
              name={isPasswordVisible ? 'visibility-off' : 'visibility'}
              size={22}
              color="#6b7280"
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && !isValid && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      {hasError && (
        <Text style={styles.errorMessage} testID={`${testID}-error`}>
          {meta.error}
        </Text>
      )}
    </Animated.View>
  );
};

export default FormField;