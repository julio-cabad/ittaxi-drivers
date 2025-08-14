import { Dimensions, Platform } from 'react-native';

// Navigation helpers
export const navigationHelper = {
  goBack: (navigation: any) => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  },
  
  resetToScreen: (navigation: any, screenName: string) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screenName }],
    });
  },
};

// Device helpers
export const deviceHelper = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  
  getScreenDimensions: () => {
    const { width, height } = Dimensions.get('screen');
    return { width, height };
  },
  
  getWindowDimensions: () => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  },
};

// Validation helpers
export const validationHelper = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  isPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },
  
  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },
};

// String helpers
export const stringHelper = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  truncate: (str: string, length: number): string => {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  },
  
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },
};

// Async helpers
export const asyncHelper = {
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  withTimeout: <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      ),
    ]);
  },
};