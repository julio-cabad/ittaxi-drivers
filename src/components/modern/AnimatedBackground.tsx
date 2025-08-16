import React, { useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { 
  COLORS, 
  GRADIENTS, 
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
} from '../../constants/modernDesignSystem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type BackgroundVariant = 'auth' | 'onboarding' | 'main' | 'success' | 'error';

interface AnimatedBackgroundProps {
  variant?: BackgroundVariant;
  particleCount?: number;
  enableParticles?: boolean;
  enableGradientAnimation?: boolean;
  enableBlur?: boolean;
  blurAmount?: number;
  customColors?: string[];
  children?: React.ReactNode;
  style?: ViewStyle;
}

const variantGradients: Record<BackgroundVariant, string[]> = {
  auth: [GRADIENTS.primary.colors[0], GRADIENTS.primary.colors[1], COLORS.background.dark],
  onboarding: [GRADIENTS.secondary.colors[0], GRADIENTS.secondary.colors[1], COLORS.primary.main],
  main: [COLORS.background.main, COLORS.background.light, COLORS.background.card],
  success: [GRADIENTS.success.colors[0], GRADIENTS.success.colors[1], COLORS.semantic.success],
  error: [GRADIENTS.error.colors[0], GRADIENTS.error.colors[1], COLORS.semantic.error],
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Particle component to handle individual particle animations
const AnimatedParticle: React.FC<{
  index: number;
  enabled: boolean;
}> = ({ enabled }) => {
  const x = useSharedValue(Math.random() * SCREEN_WIDTH);
  const y = useSharedValue(Math.random() * SCREEN_HEIGHT);
  const scale = useSharedValue(Math.random() * 0.5 + 0.5);
  const opacity = useSharedValue(Math.random() * 0.3 + 0.2);
  
  const size = useMemo(() => Math.random() * 30 + 20, []);
  const delay = useMemo(() => Math.random() * ANIMATION_DELAYS.stagger * 10, []);
  const duration = useMemo(() => ANIMATION_DURATIONS.slow * (2 + Math.random() * 2), []);

  useEffect(() => {
    if (!enabled) return;

    x.value = withDelay(
      delay,
      withRepeat(
        withTiming(Math.random() * SCREEN_WIDTH, {
          duration: duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    y.value = withDelay(
      delay,
      withRepeat(
        withTiming(-size, {
          duration: duration * 1.5,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.5, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.5, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.1, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(x);
      cancelAnimation(y);
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [enabled, x, y, scale, opacity, size, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: COLORS.accent.light,
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  if (!enabled) return null;

  return <Animated.View style={animatedStyle} pointerEvents="none" />;
};

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'auth',
  particleCount = 15,
  enableParticles = true,
  enableGradientAnimation = true,
  enableBlur = false,
  blurAmount = 10,
  customColors,
  children,
  style,
}) => {
  const gradientRotation = useSharedValue(0);
  const gradientScale = useSharedValue(1);
  const gradientOpacity = useSharedValue(0.95);

  const gradientColors = customColors || variantGradients[variant];

  useEffect(() => {
    if (enableGradientAnimation) {
      gradientRotation.value = withRepeat(
        withTiming(360, {
          duration: ANIMATION_DURATIONS.slow * 4,
          easing: Easing.linear,
        }),
        -1,
        false
      );

      gradientScale.value = withRepeat(
        withSequence(
          withTiming(1.1, {
            duration: ANIMATION_DURATIONS.slow * 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: ANIMATION_DURATIONS.slow * 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );

      gradientOpacity.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: ANIMATION_DURATIONS.slow,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.9, {
            duration: ANIMATION_DURATIONS.slow,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );
    }

    return () => {
      cancelAnimation(gradientRotation);
      cancelAnimation(gradientScale);
      cancelAnimation(gradientOpacity);
    };
  }, [enableGradientAnimation, gradientRotation, gradientScale, gradientOpacity]);

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: enableGradientAnimation ? `${gradientRotation.value}deg` : '0deg',
        },
        {
          scale: enableGradientAnimation ? gradientScale.value : 1,
        },
      ],
      opacity: enableGradientAnimation ? gradientOpacity.value : 1,
    };
  });

  const particleIndices = useMemo(
    () => Array.from({ length: particleCount }, (_, i) => i),
    [particleCount]
  );

  return (
    <View style={[styles.container, style]}>
      <AnimatedLinearGradient
        colors={gradientColors}
        style={[styles.gradient, animatedGradientStyle]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
      />
      
      {enableParticles && (
        <View style={styles.particlesContainer} pointerEvents="none">
          {particleIndices.map((index) => (
            <AnimatedParticle key={index} index={index} enabled={enableParticles} />
          ))}
        </View>
      )}

      {enableBlur && (
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={blurAmount}
          reducedTransparencyFallbackColor={COLORS.background.overlay}
        />
      )}

      {children}
    </View>
  );
};

export const AnimatedBackgroundWithOrientation: React.FC<AnimatedBackgroundProps> = (props) => {
  const [dimensions, setDimensions] = React.useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isLandscape = dimensions.width > dimensions.height;

  const orientationStyle: ViewStyle = useMemo(() => ({
    flexDirection: isLandscape ? 'row' : 'column',
  }), [isLandscape]);

  const combinedStyle: ViewStyle = useMemo(() => {
    if (props.style) {
      return { ...props.style, ...orientationStyle };
    }
    return orientationStyle;
  }, [props.style, orientationStyle]);

  return (
    <AnimatedBackground {...props} style={combinedStyle}>
      {props.children}
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 1.5,
    left: -SCREEN_WIDTH * 0.25,
    top: -SCREEN_HEIGHT * 0.25,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default AnimatedBackground;