import React from 'react';
import { View, ViewStyle, StatusBar, Platform } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { itBg } from '../../utils';

interface ScreenWrapperProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  safeAreaStyle?: ViewStyle;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  statusBarColor?: string;
  statusBarTranslucent?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  safeAreaStyle,
  backgroundColor = itBg,
  statusBarStyle = 'dark-content',
  statusBarColor = itBg,
  statusBarTranslucent = false,
}) => {
  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === 'android' ? statusBarColor : undefined}
        translucent={statusBarTranslucent}
      />
      <SafeAreaView
        edges={edges}
        style={[
          tw`flex-1`,
          { backgroundColor: statusBarColor },
          safeAreaStyle,
        ]}
      >
        <View style={[tw`flex-1`, { backgroundColor }, style]}>
          {children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ScreenWrapper;