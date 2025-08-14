import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { Button } from '../commons';
import tw from 'twrnc';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to crash reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={tw`flex-1 justify-center items-center px-6 bg-white`}>
          <Text style={tw`text-2xl font-bold text-itRed mb-4`}>
            Oops! Something went wrong
          </Text>
          <Text style={tw`text-base text-itDarkGray text-center mb-8`}>
            We're sorry for the inconvenience. Please try again.
          </Text>
          
          {__DEV__ && this.state.error && (
            <View style={tw`bg-gray-100 p-4 rounded-lg mb-6 w-full`}>
              <Text style={tw`text-sm text-gray-600 font-mono`}>
                {this.state.error.toString()}
              </Text>
            </View>
          )}
          
          <Button
            variant="primary"
            size="large"
            onPress={this.handleRetry}
          >
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;