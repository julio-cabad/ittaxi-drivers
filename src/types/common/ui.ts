/**
 * Common UI types and interfaces
 * Used across all UI components
 */

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface BaseComponentProps {
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: string | null;
  errorCode?: string;
}

export interface FormFieldState {
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ToastConfig {
  type: Variant;
  title: string;
  message?: string;
  duration?: number;
  position?: Position;
  autoHide?: boolean;
}

export interface ModalConfig {
  isVisible: boolean;
  title?: string;
  content?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  colors: Record<string, string>;
  spacing: Record<string, number>;
  typography: Record<string, any>;
}