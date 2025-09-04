import React from 'react';
import { StatusBar, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenWrapper } from '../..';
import { itPurple } from '../../../utils/colors';
import { COLORS } from '../../../constants/modernDesignSystem';

interface AuthScreenWrapperProps {
  children: React.ReactNode;
}

export const AuthScreenWrapper: React.FC<AuthScreenWrapperProps> = ({ children }) => {
  return (
    <ScreenWrapper>
      <StatusBar backgroundColor={itPurple} barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <LinearGradient
          colors={[itPurple, COLORS.secondary.main, itPurple]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
