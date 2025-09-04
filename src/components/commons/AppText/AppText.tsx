import React from 'react';
import { Text } from 'react-native';
import { AppTextProps } from './AppText.types';
import { appTextStyles } from './AppText.styles';
import tw from 'twrnc';

const AppText: React.FC<AppTextProps> = ({
  children,
  style,
  color,
  fontSize,
  fontWeight,
  textAlign,
}) => {
  const dynamicStyles = [
    appTextStyles.baseText,
    color && { color },
    fontSize && { fontSize },
    fontWeight && { fontWeight },
    textAlign && { textAlign },
    style,
  ];

  return <Text style={dynamicStyles}>{children}</Text>;
};

export default AppText;
