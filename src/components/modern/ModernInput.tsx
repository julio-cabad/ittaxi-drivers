import React, { useRef, useState } from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  StyleSheet,
  Animated,
} from 'react-native';
import { useField } from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { itPrimary, itRed } from '../../utils/colors';


export type InputVariant = 'default' | 'filled' | 'outlined' | 'underlined';
export type InputSize = 'small' | 'medium' | 'large';

interface ModernInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  height?: number; // Nueva prop para altura personalizada
  secureTextEntry?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showSuccessIndicator?: boolean;
  animationDelay?: number;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'username' | 'password' | 'email' | 'name';
  testID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
}

const ModernInput: React.FC<ModernInputProps> = ({
  name,
  label,
  placeholder,
  size = 'medium',
  height, // Nueva prop para altura personalizada
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
}) => {
  const [field, meta, helpers] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Animation values using React Native's Animated API
  const labelAnimation = useRef(new Animated.Value(field.value ? 1 : 0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const hasError = meta.touched && meta.error;
  const hasValue = field.value && field.value.length > 0;
  const isValid = meta.touched && !meta.error && hasValue;

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);

    // Animate label up
    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Subtle scale animation
    Animated.spring(scaleAnimation, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();

    onFocus?.();
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);

    // Animate label down if no value
    if (!hasValue) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    // Reset scale
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    helpers.setTouched(true);
    onBlur?.();
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Get size styles - now with custom height support
  const getSizeStyles = () => {
    const baseStyles = {
      small: { height: 48, paddingHorizontal: 16, fontSize: 14 },
      large: { height: 72, paddingHorizontal: 24, fontSize: 18 },
      medium: { height: 64, paddingHorizontal: 20, fontSize: 17 },
    };

    const selectedStyle = baseStyles[size] || baseStyles.medium;

    // Si se pasa height personalizado, lo usamos
    if (height) {
      return {
        ...selectedStyle,
        height: height,
      };
    }

    return selectedStyle;
  };

  const sizeStyles = getSizeStyles();

  // Animated label styles
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

  // Container animated style
  const animatedContainerStyle = {
    transform: [{ scale: scaleAnimation }],
  };

  return (
    <Animated.View
      style={[styles.container, containerStyle, animatedContainerStyle]}
    >
      {/* Floating Label */}
      {label && (
        <Animated.Text style={[styles.label, labelStyle, animatedLabelStyle]}>
          {label}
        </Animated.Text>
      )}

      {/* Input Container */}
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
        {/* Left Icon */}
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        {/* Text Input */}
        <TextInput
          style={[
            styles.textInput,
            {
              fontSize: sizeStyles.fontSize,
              color: disabled ? '#9ca3af' : '#111827',
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
        />

        {/* Success Indicator */}
        {isValid && showSuccessIndicator && (
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={20} color="#10b981" />
          </View>
        )}

        {/* Password Toggle */}
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

        {/* Right Icon */}
        {rightIcon && !secureTextEntry && !isValid && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {/* Error Message */}
      {hasError && (
        <Text style={styles.errorMessage} testID={`${testID}-error`}>
          {meta.error}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // Más espacio entre inputs
  },
  label: {
    position: 'absolute',
    left: 20,
    top: 18, // Ajustado para inputs más grandes
    zIndex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16, // Más redondeado
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    // fontFamily: 'System',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  successIcon: {
    marginLeft: 8,
  },
  passwordToggle: {
    marginLeft: 8,
    padding: 4,
  },
  errorMessage: {
    color: itRed,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 20,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#f3f4f6',
  },
});

export default ModernInput;
