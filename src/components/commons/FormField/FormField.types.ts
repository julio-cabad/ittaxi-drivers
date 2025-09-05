import { ViewStyle, TextStyle, KeyboardTypeOptions } from 'react-native';

export type InputVariant = 'default' | 'filled' | 'outlined' | 'underlined';
export type InputSize = 'small' | 'medium' | 'large';

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  height?: number;
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
  blurOnSubmit?: boolean;
}
