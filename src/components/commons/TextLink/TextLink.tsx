import React from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from '../AppText/AppText';
import { TextLinkProps } from './TextLink.types';
import { textLinkStyles } from './TextLink.styles';

const TextLink: React.FC<TextLinkProps> = ({
  onPress,
  children,
  ...appTextProps
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={textLinkStyles.container}>
      <AppText {...appTextProps}>{children}</AppText>
    </TouchableOpacity>
  );
};

export default TextLink;
