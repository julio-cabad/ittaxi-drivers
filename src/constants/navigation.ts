export const SCREEN_NAMES = {
  AUTH: {
    LOGIN: 'Login',
    FORGOT_PASSWORD: 'ForgotPassword',
    REGISTER: 'RegisterScreen',
  },
  ONBOARDING: {
    REGISTER: 'RegisterScreen',
    PERSONAL_DATA: 'PersonalDataScreen',
    VEHICLE_DATA: 'VehicleDataScreen',
    VEHICLE_PHOTOS: 'VehiclePhotosScreen',
    DOCUMENTS_UPLOAD: 'DocumentsUploadScreen',
    REVIEW_SUBMIT: 'ReviewAndSubmitScreen',
    PENDING_REVIEW: 'PendingReviewScreen',
    DRIVER_STATUS: 'DriverStatusScreen',
  },
  MAIN: {
    HOME: 'Home',
    PROFILE: 'Profile',
    SETTINGS: 'Settings',
  }
} as const;

// Type definitions for navigation parameters
export type AuthStackParamList = {
  [SCREEN_NAMES.AUTH.LOGIN]: undefined;
  [SCREEN_NAMES.AUTH.FORGOT_PASSWORD]: undefined;
  [SCREEN_NAMES.AUTH.REGISTER]: undefined;
};

export type OnboardingStackParamList = {
  [SCREEN_NAMES.ONBOARDING.REGISTER]: undefined;
  [SCREEN_NAMES.ONBOARDING.PERSONAL_DATA]: undefined;
  [SCREEN_NAMES.ONBOARDING.VEHICLE_DATA]: undefined;
  [SCREEN_NAMES.ONBOARDING.VEHICLE_PHOTOS]: undefined;
  [SCREEN_NAMES.ONBOARDING.DOCUMENTS_UPLOAD]: undefined;
  [SCREEN_NAMES.ONBOARDING.REVIEW_SUBMIT]: undefined;
  [SCREEN_NAMES.ONBOARDING.PENDING_REVIEW]: undefined;
  [SCREEN_NAMES.ONBOARDING.DRIVER_STATUS]: undefined;
};

export type MainStackParamList = {
  [SCREEN_NAMES.MAIN.HOME]: undefined;
  [SCREEN_NAMES.MAIN.PROFILE]: undefined;
  [SCREEN_NAMES.MAIN.SETTINGS]: undefined;
};

// Root navigation type
export type RootStackParamList = AuthStackParamList & OnboardingStackParamList & MainStackParamList;