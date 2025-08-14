import { Dimensions, Platform, StatusBar } from 'react-native';

export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  statusBarHeight: number;
}

export const getDeviceInfo = (): DeviceInfo => {
  const screen = Dimensions.get('screen');
  const window = Dimensions.get('window');
  
  return {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    screenWidth: screen.width,
    screenHeight: screen.height,
    windowWidth: window.width,
    windowHeight: window.height,
    statusBarHeight: StatusBar.currentHeight || 0,
  };
};

export const isTablet = (): boolean => {
  const { screenWidth, screenHeight } = getDeviceInfo();
  const aspectRatio = screenHeight / screenWidth;
  return Math.min(screenWidth, screenHeight) >= 600 && aspectRatio <= 1.6;
};

export const getOrientation = (): 'portrait' | 'landscape' => {
  const { screenWidth, screenHeight } = getDeviceInfo();
  return screenHeight > screenWidth ? 'portrait' : 'landscape';
};