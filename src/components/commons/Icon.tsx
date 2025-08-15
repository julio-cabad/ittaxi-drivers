/**
 * Professional icon component with customizable styles
 */
import React from 'react';
import { TextStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Using string type to be compatible with all Ionicons names
export type IconName = string;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000000',
  style,
}) => {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};