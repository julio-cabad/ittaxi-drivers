/**
 * Common component prop types
 * Shared prop interfaces used across components
 */

import type { BaseComponentProps } from '../common/ui';

export interface CommonProps extends BaseComponentProps {
  className?: string;
  style?: any;
  children?: React.ReactNode;
}

export interface ButtonProps extends CommonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface InputProps extends CommonProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

// Placeholder - add specific component props when needed