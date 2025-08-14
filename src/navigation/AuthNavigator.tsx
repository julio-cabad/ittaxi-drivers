import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Login, ForgotPassword } from '../screens/auth';
import { 
  RegisterScreen, 
  PersonalDataScreen, 
  VehicleDataScreen, 
  VehiclePhotosScreen, 
  DocumentsUploadScreen, 
  ReviewAndSubmitScreen, 
  PendingReviewScreen, 
  DriverStatusScreen 
} from '../screens/onboarding';
import { SCREEN_NAMES, RootStackParamList } from '../constants/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName={SCREEN_NAMES.AUTH.LOGIN}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen 
        name={SCREEN_NAMES.AUTH.LOGIN} 
        component={Login} 
      />
      <Stack.Screen 
        name={SCREEN_NAMES.AUTH.FORGOT_PASSWORD} 
        component={ForgotPassword} 
      />
      
      {/* Onboarding Screens */}
      <Stack.Screen 
        name={SCREEN_NAMES.ONBOARDING.REGISTER} 
        component={RegisterScreen} 
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ONBOARDING.PERSONAL_DATA} 
        component={PersonalDataScreen} 
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ONBOARDING.VEHICLE_DATA} 
        component={VehicleDataScreen} 
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ONBOARDING.VEHICLE_PHOTOS} 
        component={VehiclePhotosScreen} 
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ONBOARDING.DOCUMENTS_UPLOAD} 
        component={DocumentsUploadScreen} 
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ONBOARDING.REVIEW_SUBMIT} 
        component={ReviewAndSubmitScreen} 
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ONBOARDING.PENDING_REVIEW} 
        component={PendingReviewScreen} 
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ONBOARDING.DRIVER_STATUS} 
        component={DriverStatusScreen} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
export type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;