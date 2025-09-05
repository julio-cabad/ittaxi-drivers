import { ViewStyle, TextStyle } from 'react-native';

export type DatePickerSize = 'small' | 'medium' | 'large';
export type DatePickerVariant = 'default' | 'filled' | 'outlined';

export interface DatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  size?: DatePickerSize;
  variant?: DatePickerVariant;
  disabled?: boolean;
  required?: boolean;
  maxDate?: string;
  minDate?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showSuccessIndicator?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  animationDelay?: number;
}

export type ViewMode = 'day' | 'month' | 'year';