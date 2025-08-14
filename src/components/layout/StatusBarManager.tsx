import React, { useEffect } from 'react';
import { StatusBar, Platform, View } from 'react-native';

export interface StatusBarConfig {
  barStyle: 'light-content' | 'dark-content' | 'default';
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
}

interface StatusBarManagerProps extends StatusBarConfig {
  children?: React.ReactNode;
}

const StatusBarManager: React.FC<StatusBarManagerProps> = ({
  barStyle = 'dark-content',
  backgroundColor = '#ffffff',
  translucent = false,
  hidden = false,
  children,
}) => {
  useEffect(() => {
    // Force status bar update
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(backgroundColor || '#ffffff', true);
      StatusBar.setBarStyle(barStyle, true);
      StatusBar.setTranslucent(translucent);
    } else {
      StatusBar.setBarStyle(barStyle, true);
    }
  }, [barStyle, backgroundColor, translucent]);

  return (
    <>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
        translucent={translucent}
        hidden={hidden}
      />
      {Platform.OS === 'ios' && backgroundColor && backgroundColor !== 'transparent' && (
        <View 
          style={{ 
            height: 44, // iOS status bar height
            backgroundColor: backgroundColor,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }} 
        />
      )}
      {children}
    </>
  );
};

export default StatusBarManager;