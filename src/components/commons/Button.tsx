import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { itPrimary, itSecondary } from '../../utils/colors';
import tw from 'twrnc';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  testID,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.primaryButton;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextVariantStyles = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return styles.whiteText;
      case 'outline':
      case 'ghost':
        return styles.primaryText;
      default:
        return styles.whiteText;
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        tw`rounded-lg flex-row items-center justify-center`,
        getVariantStyles(),
        getSizeStyles(),
        isDisabled && tw`opacity-50`,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost' ? '#1c3a69' : '#ffffff'
          }
          style={tw`mr-2`}
        />
      )}

      {leftIcon && !loading && <View style={tw`mr-2`}>{leftIcon}</View>}

      <Text
        style={[
          tw`font-semibold text-center`,
          getTextVariantStyles(),
          getTextSizeStyles(),
          textStyle,
        ]}
      >
        {children}
      </Text>

      {rightIcon && !loading && <View style={tw`ml-2`}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Button Variants
  primaryButton: {
    backgroundColor: itPrimary,
  },
  secondaryButton: {
    backgroundColor: itSecondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: itPrimary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  
  // Button Sizes
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mediumButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  largeButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  // Text Colors
  whiteText: {
    color: '#ffffff',
  },
  primaryText: {
    color: itPrimary,
  },
  
  // Text Sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default Button;
