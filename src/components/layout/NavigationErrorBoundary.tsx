import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../commons';
import ErrorBoundary from './ErrorBoundary';
import tw from 'twrnc';

interface NavigationErrorBoundaryProps {
  children: React.ReactNode;
  onNavigationError?: (error: Error) => void;
}

const NavigationErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <View style={tw`flex-1 justify-center items-center px-6 bg-white`}>
    <Text style={tw`text-2xl font-bold text-itRed mb-4`}>
      Navigation Error
    </Text>
    <Text style={tw`text-base text-itDarkGray text-center mb-8`}>
      There was a problem with navigation. Please restart the app or try again.
    </Text>
    
    <Button
      variant="primary"
      size="large"
      onPress={onRetry}
    >
      Restart Navigation
    </Button>
  </View>
);

const NavigationErrorBoundary: React.FC<NavigationErrorBoundaryProps> = ({
  children,
  onNavigationError,
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log navigation-specific error
    console.error('Navigation Error:', error, errorInfo);
    onNavigationError?.(error);
  };

  const handleRetry = () => {
    // In React Native, we can't reload like in web, so we'll just reset the error boundary
    console.log('Restarting navigation...');
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={<NavigationErrorFallback onRetry={handleRetry} />}
    >
      {children}
    </ErrorBoundary>
  );
};

export default NavigationErrorBoundary;