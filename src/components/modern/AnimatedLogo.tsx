import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  ImageSourcePropType,
  ViewStyle,
  ImageStyle,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import LottieView, { AnimationObject } from 'lottie-react-native';
import {
  SHADOWS,
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  ANIMATION_CONFIG,
  getResponsiveValue,
} from '../../constants/modernDesignSystem';

export type LogoSize = 'small' | 'medium' | 'large' | 'xlarge';
export type AnimationType = 'scale' | 'fade' | 'bounce' | 'rotate' | 'all';
export type GlowVariant = 'primary' | 'secondary' | 'accent' | 'none';

interface AnimatedLogoProps {
  source?: ImageSourcePropType;
  lottieSource?: string | AnimationObject | { uri: string };
  size?: LogoSize;
  customSize?: number;
  animationType?: AnimationType;
  glowVariant?: GlowVariant;
  enableGlow?: boolean;
  enablePulse?: boolean;
  enableEntrance?: boolean;
  entranceDelay?: number;
  onAnimationComplete?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  testID?: string;
}

// Size configurations
const sizeConfig: Record<LogoSize, number> = {
  small: getResponsiveValue(60, 70, 80),
  medium: getResponsiveValue(80, 100, 120),
  large: getResponsiveValue(120, 150, 180),
  xlarge: getResponsiveValue(150, 200, 250),
};

// Glow shadow configurations
const glowShadows: Record<GlowVariant, any> = {
  primary: [
    {
      ...SHADOWS.glow.primary,
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    {
      ...SHADOWS.glow.primary,
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    {
      ...SHADOWS.glow.primary,
      shadowOpacity: 0.1,
      shadowRadius: 24,
    },
  ],
  secondary: [
    {
      ...SHADOWS.glow.secondary,
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    {
      ...SHADOWS.glow.secondary,
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    {
      ...SHADOWS.glow.secondary,
      shadowOpacity: 0.1,
      shadowRadius: 24,
    },
  ],
  accent: [
    {
      ...SHADOWS.glow.accent,
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    {
      ...SHADOWS.glow.accent,
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    {
      ...SHADOWS.glow.accent,
      shadowOpacity: 0.1,
      shadowRadius: 24,
    },
  ],
  none: [],
};

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  source = require('../../assets/logo.png'),
  lottieSource,
  size = 'medium',
  customSize,
  animationType = 'all',
  glowVariant = 'primary',
  enableGlow = true,
  enablePulse = true,
  enableEntrance = true,
  entranceDelay = 0,
  onAnimationComplete,
  style,
  imageStyle,
  testID = 'animated-logo',
}) => {
  const scale = useSharedValue(enableEntrance ? 0 : 1);
  const opacity = useSharedValue(enableEntrance ? 0 : 1);
  const rotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const lottieRef = useRef<LottieView>(null);

  const logoSize = customSize || sizeConfig[size];

  // Entrance animation
  useEffect(() => {
    if (enableEntrance) {
      // Scale animation
      if (animationType === 'scale' || animationType === 'all') {
        scale.value = withDelay(
          entranceDelay,
          withSpring(1, {
            ...ANIMATION_CONFIG.spring,
            damping: 12,
            stiffness: 100,
          }),
        );
      }

      // Fade animation
      if (animationType === 'fade' || animationType === 'all') {
        opacity.value = withDelay(
          entranceDelay,
          withTiming(1, {
            duration: ANIMATION_DURATIONS.slow,
            easing: Easing.out(Easing.ease),
          }),
        );
      }

      // Bounce animation
      if (animationType === 'bounce' || animationType === 'all') {
        scale.value = withDelay(
          entranceDelay,
          withSequence(
            withSpring(1.2, {
              ...ANIMATION_CONFIG.spring,
              damping: 5,
              stiffness: 200,
            }),
            withSpring(1, {
              ...ANIMATION_CONFIG.spring,
              damping: 10,
              stiffness: 150,
            }),
          ),
        );
      }

      // Rotate animation
      if (animationType === 'rotate' || animationType === 'all') {
        rotation.value = withDelay(
          entranceDelay,
          withTiming(360, {
            duration: ANIMATION_DURATIONS.slow,
            easing: Easing.out(Easing.ease),
          }),
        );
      }

      // Glow fade in
      if (enableGlow) {
        glowOpacity.value = withDelay(
          entranceDelay + ANIMATION_DELAYS.medium,
          withTiming(1, {
            duration: ANIMATION_DURATIONS.slow,
            easing: Easing.inOut(Easing.ease),
          }),
        );
      }

      // Trigger completion callback
      if (onAnimationComplete) {
        const totalDuration = entranceDelay + ANIMATION_DURATIONS.slow;
        setTimeout(() => {
          runOnJS(onAnimationComplete)();
        }, totalDuration);
      }
    }

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(rotation);
      cancelAnimation(glowOpacity);
    };
  }, [
    enableEntrance,
    animationType,
    entranceDelay,
    scale,
    opacity,
    rotation,
    glowOpacity,
    enableGlow,
    onAnimationComplete,
  ]);

  // Pulse animation
  useEffect(() => {
    if (enablePulse && !enableEntrance) {
      pulseScale.value = withSequence(
        withTiming(1.05, {
          duration: ANIMATION_DURATIONS.slow * 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: ANIMATION_DURATIONS.slow * 2,
          easing: Easing.inOut(Easing.ease),
        }),
      );

      // Set up repeating pulse
      const interval = setInterval(() => {
        pulseScale.value = withSequence(
          withTiming(1.05, {
            duration: ANIMATION_DURATIONS.slow * 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: ANIMATION_DURATIONS.slow * 2,
            easing: Easing.inOut(Easing.ease),
          }),
        );
      }, ANIMATION_DURATIONS.slow * 4);

      return () => {
        clearInterval(interval);
        cancelAnimation(pulseScale);
      };
    }
  }, [enablePulse, enableEntrance, pulseScale]);

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => {
    const finalScale = enablePulse
      ? pulseScale.value * scale.value
      : scale.value;

    return {
      opacity: opacity.value,
      transform: [{ scale: finalScale }, { rotate: `${rotation.value}deg` }],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        glowOpacity.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP,
      ),
    };
  });

  // Render glow layers
  const renderGlowLayers = () => {
    if (!enableGlow || glowVariant === 'none') return null;

    const shadows = glowShadows[glowVariant];

    return shadows.map((shadow: any, index: number) => (
      <Animated.View
        key={`glow-${index}`}
        style={[
          styles.glowLayer,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
            ...shadow,
          },
          animatedGlowStyle,
        ]}
        pointerEvents="none"
      />
    ));
  };

  // Main render
  return (
    <View style={[styles.container, style]} testID={testID}>
      {renderGlowLayers()}

      <Animated.View style={[styles.logoWrapper, animatedContainerStyle]}>
        {lottieSource ? (
          <LottieView
            ref={lottieRef}
            source={lottieSource}
            style={{
              width: logoSize,
              height: logoSize,
              ...imageStyle,
            }}
            autoPlay
            loop
          />
        ) : (
          <Image
            source={source}
            style={[
              {
                width: logoSize,
                height: logoSize,
              },
              styles.logo,
              imageStyle,
            ]}
            resizeMode="contain"
          />
        )}
      </Animated.View>
    </View>
  );
};

// Memoized version for performance optimization
export const MemoizedAnimatedLogo = React.memo(AnimatedLogo);

// Hook for controlling logo animations programmatically
export const useLogoAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animateLogo = (type: AnimationType) => {
    switch (type) {
      case 'scale':
        scale.value = withSequence(
          withSpring(1.2, ANIMATION_CONFIG.spring),
          withSpring(1, ANIMATION_CONFIG.spring),
        );
        break;
      case 'fade':
        opacity.value = withSequence(
          withTiming(0, { duration: ANIMATION_DURATIONS.fast }),
          withTiming(1, { duration: ANIMATION_DURATIONS.fast }),
        );
        break;
      case 'bounce':
        scale.value = withSequence(
          withSpring(0.8, { ...ANIMATION_CONFIG.spring, damping: 5 }),
          withSpring(1.2, { ...ANIMATION_CONFIG.spring, damping: 5 }),
          withSpring(1, { ...ANIMATION_CONFIG.spring, damping: 10 }),
        );
        break;
      case 'rotate':
        rotation.value = withSequence(
          withTiming(180, { duration: ANIMATION_DURATIONS.normal }),
          withTiming(360, { duration: ANIMATION_DURATIONS.normal }),
        );
        break;
      case 'all':
        scale.value = withSpring(1.1, ANIMATION_CONFIG.spring);
        rotation.value = withTiming(360, {
          duration: ANIMATION_DURATIONS.slow,
        });
        opacity.value = withSequence(
          withTiming(0.8, { duration: ANIMATION_DURATIONS.fast }),
          withTiming(1, { duration: ANIMATION_DURATIONS.fast }),
        );
        break;
    }
  };

  const resetAnimation = () => {
    scale.value = withTiming(1, { duration: ANIMATION_DURATIONS.fast });
    opacity.value = withTiming(1, { duration: ANIMATION_DURATIONS.fast });
    rotation.value = withTiming(0, { duration: ANIMATION_DURATIONS.fast });
  };

  return {
    scale,
    opacity,
    rotation,
    animateLogo,
    resetAnimation,
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    // Additional logo styles if needed
  },
  glowLayer: {
    position: 'absolute',
  },
});

export default AnimatedLogo;
