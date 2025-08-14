import React from 'react';
import { View, ActivityIndicator, Text, ViewStyle } from 'react-native';
import tw from 'twrnc';

export type LoadingSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: LoadingSize;
  color?: string;
  text?: string;
  style?: ViewStyle;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#1c3a69',
  text,
  style,
  overlay = false,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'small';
    }
  };

  const content = (
    <View style={[tw`items-center justify-center`, style]}>
      <ActivityIndicator size={getSize()} color={color} />
      {text && (
        <Text style={tw`mt-3 text-base text-itDarkGray text-center`}>
          {text}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View style={tw`absolute inset-0 bg-white bg-opacity-80 items-center justify-center z-50`}>
        {content}
      </View>
    );
  }

  return content;
};

export default LoadingSpinner;