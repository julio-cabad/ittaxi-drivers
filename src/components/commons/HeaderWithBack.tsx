/**
 * Professional reusable header component with back button
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, IconName } from './Icon';

export interface HeaderWithBackProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backButtonColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  backButtonStyle?: ViewStyle;
  backIconName?: IconName;
  backIconSize?: number;
  titleSize?: number;
  subtitleSize?: number;
  spacing?: 'compact' | 'normal' | 'spacious';
  alignment?: 'left' | 'center';
}

export const HeaderWithBack: React.FC<HeaderWithBackProps> = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  backButtonColor = '#ffffff',
  titleColor = '#ffffff',
  subtitleColor = 'rgba(255, 255, 255, 0.9)',
  backgroundColor = 'transparent',
  containerStyle,
  titleStyle,
  subtitleStyle,
  backButtonStyle,
  backIconName = 'arrow-left',
  backIconSize = 24,
  titleSize = 32,
  subtitleSize = 18,
  spacing = 'normal',
  alignment = 'left',
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const getSpacingValues = () => {
    switch (spacing) {
      case 'compact':
        return {
          paddingTop: 60,
          paddingBottom: 40,
          titleMargin: 2,
          subtitleMargin: 0,
        };
      case 'spacious':
        return {
          paddingTop: 80,
          paddingBottom: 50,
          titleMargin: 8,
          subtitleMargin: 4,
        };
      default:
        return {
          paddingTop: 25,
          paddingBottom: 45,
          titleMargin: 4,
          subtitleMargin: 0,
        };
    }
  };

  const spacingValues = getSpacingValues();

  const containerStyles: ViewStyle = {
    backgroundColor,
    paddingHorizontal: 24,
    paddingTop: spacingValues.paddingTop,
    paddingBottom: spacingValues.paddingBottom,
    ...containerStyle,
  };

  const headerContentStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: alignment === 'center' ? 'center' : 'flex-start',
  };

  const textContainerStyles: ViewStyle = {
    flex: showBackButton ? 1 : undefined,
    marginLeft: showBackButton ? 16 : 0,
    alignItems: alignment === 'center' ? 'center' : 'flex-start',
  };

  const titleStyles: TextStyle = {
    fontSize: titleSize,
    fontWeight: 'bold',
    color: titleColor,
    marginBottom: spacingValues.titleMargin,
    textAlign: alignment,
    lineHeight: titleSize * 1.2,
    ...titleStyle,
  };

  const subtitleStyles: TextStyle = {
    fontSize: subtitleSize,
    color: subtitleColor,
    textAlign: alignment,
    lineHeight: subtitleSize * 1.3,
    marginTop: spacingValues.subtitleMargin,
    ...subtitleStyle,
  };

  const backButtonStyles: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: Math.max(0, (titleSize - 40) / 2), // Center with title font size
    ...backButtonStyle,
  };

  return (
    <View style={containerStyles}>
      <View style={headerContentStyles}>
        {showBackButton && (
          <TouchableOpacity
            style={backButtonStyles}
            onPress={handleBackPress}
            accessibilityLabel="Volver atrás"
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Icon
              name={backIconName}
              size={backIconSize}
              color={backButtonColor}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        )}

        <View style={textContainerStyles}>
          <Text style={titleStyles}>{title}</Text>
          {subtitle && <Text style={subtitleStyles}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    // Ionicons handles its ow
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

// Preset configurations for common use cases
export const HeaderPresets = {
  onboarding: {
    spacing: 'normal' as const,
    alignment: 'left' as const,
    titleSize: 32,
    subtitleSize: 18,
    backIconName: 'arrow-back-sharp' as IconName,
    backIconSize: 24,
  },

  onboardingCompact: {
    spacing: 'compact' as const,
    alignment: 'left' as const,
    titleSize: 28,
    subtitleSize: 16,
    backIconName: 'arrow-back-sharp' as IconName,
    backIconSize: 22,
  },

  centered: {
    spacing: 'normal' as const,
    alignment: 'center' as const,
    titleSize: 28,
    subtitleSize: 16,
    backIconName: 'arrow-back-sharp' as IconName,
    backIconSize: 24,
  },

  minimal: {
    spacing: 'compact' as const,
    alignment: 'left' as const,
    titleSize: 24,
    subtitleSize: 14,
    backIconName: 'arrow-back-sharp' as IconName,
    backIconSize: 20,
    showBackButton: false,
  },
} as const;
