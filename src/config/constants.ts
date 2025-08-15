/**
 * Application constants configuration
 * Centralized configuration for all app constants
 */

export const APP_CONFIG = {
  // API Configuration
  api: {
    baseUrl: 'https://api.instataxi.com', // TODO: Move to environment config
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Storage Configuration
  storage: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxDocumentSize: 10 * 1024 * 1024, // 10MB
    allowedImageFormats: ['image/jpeg', 'image/jpg', 'image/png'],
    imageCompression: {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
    },
  },

  // Onboarding Configuration
  onboarding: {
    totalSteps: 8,
    autoSaveInterval: 30000, // 30 seconds
    sessionTimeout: 3600000, // 1 hour
    documents: {
      required: ['nationalIdFront', 'nationalIdBack', 'driverLicense', 'vehicleRegistration'],
      optional: ['insurance', 'backgroundCheck'],
    },
    vehiclePhotos: {
      required: ['front', 'back', 'leftSide', 'rightSide', 'interior'],
      optional: ['dashboard', 'trunk'],
    },
  },

  // Validation Rules
  validation: {
    phone: {
      minLength: 10,
      maxLength: 15,
      pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    },
    email: {
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    },
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true,
    },
    vehicle: {
      minYear: 2010,
      maxYear: new Date().getFullYear() + 1,
      licensePlatePattern: /^[A-Z0-9]{6,8}$/,
    },
  },

  // UI Configuration
  ui: {
    animationDuration: 300,
    toastDuration: 3000,
    debounceDelay: 500,
    scrollViewMaxHeight: 400,
    statusBarHeight: 44, // iOS
  },

  // Feature Flags
  features: {
    enableBiometrics: true,
    enablePushNotifications: true,
    enableOfflineMode: true,
    enableAnalytics: !__DEV__,
    enableCrashReporting: !__DEV__,
  },

  // Security
  security: {
    jwtExpirationTime: 86400, // 24 hours
    refreshTokenExpirationTime: 604800, // 7 days
    maxLoginAttempts: 5,
    lockoutDuration: 900, // 15 minutes
  },
} as const;

// Type-safe access to config
export type AppConfig = typeof APP_CONFIG;