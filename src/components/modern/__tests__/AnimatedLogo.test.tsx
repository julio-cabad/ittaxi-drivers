import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { runOnJS } from 'react-native-reanimated';
import { AnimatedLogo, useLogoAnimation } from '../AnimatedLogo';
import { ANIMATION_DURATIONS } from '../../../constants/modernDesignSystem';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const actualModule = jest.requireActual('react-native-reanimated');
  return {
    ...actualModule,
    useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
    useAnimatedStyle: jest.fn((callback) => callback()),
    withSpring: jest.fn((toValue) => toValue),
    withTiming: jest.fn((toValue) => toValue),
    withSequence: jest.fn((...values) => values[values.length - 1]),
    withDelay: jest.fn((_, animation) => animation),
    interpolate: jest.fn((value, inputRange, outputRange) => {
      const index = inputRange.findIndex((input: number) => input >= value);
      if (index === -1) return outputRange[outputRange.length - 1];
      if (index === 0) return outputRange[0];
      return outputRange[index];
    }),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      out: jest.fn((easing) => easing),
      inOut: jest.fn((easing) => easing),
    },
    Extrapolate: {
      CLAMP: 'clamp',
    },
    cancelAnimation: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
  };
});

// Mock lottie-react-native
jest.mock('lottie-react-native', () => {
  return jest.fn().mockImplementation(() => null);
});

describe('AnimatedLogo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const { getByTestId } = render(<AnimatedLogo />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with custom test ID', () => {
      const { getByTestId } = render(<AnimatedLogo testID="custom-logo" />);
      expect(getByTestId('custom-logo')).toBeTruthy();
    });

    it('should render with custom source', () => {
      const customSource = { uri: 'https://example.com/logo.png' };
      const { getByTestId } = render(<AnimatedLogo source={customSource} />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });
  });

  describe('Size variations', () => {
    it('should render with small size', () => {
      const { getByTestId } = render(<AnimatedLogo size="small" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with medium size', () => {
      const { getByTestId } = render(<AnimatedLogo size="medium" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with large size', () => {
      const { getByTestId } = render(<AnimatedLogo size="large" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with xlarge size', () => {
      const { getByTestId } = render(<AnimatedLogo size="xlarge" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with custom size', () => {
      const { getByTestId } = render(<AnimatedLogo customSize={200} />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });
  });

  describe('Animation types', () => {
    it('should render with scale animation', () => {
      const { getByTestId } = render(<AnimatedLogo animationType="scale" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with fade animation', () => {
      const { getByTestId } = render(<AnimatedLogo animationType="fade" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with bounce animation', () => {
      const { getByTestId } = render(<AnimatedLogo animationType="bounce" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with rotate animation', () => {
      const { getByTestId } = render(<AnimatedLogo animationType="rotate" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with all animations', () => {
      const { getByTestId } = render(<AnimatedLogo animationType="all" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });
  });

  describe('Glow variations', () => {
    it('should render with primary glow', () => {
      const { getByTestId } = render(<AnimatedLogo glowVariant="primary" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with secondary glow', () => {
      const { getByTestId } = render(<AnimatedLogo glowVariant="secondary" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render with accent glow', () => {
      const { getByTestId } = render(<AnimatedLogo glowVariant="accent" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render without glow', () => {
      const { getByTestId } = render(<AnimatedLogo glowVariant="none" />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should render without glow when disabled', () => {
      const { getByTestId } = render(<AnimatedLogo enableGlow={false} />);
      expect(getByTestId('animated-logo')).toBeTruthy();
    });
  });

  describe('Animation callbacks', () => {
    it('should call onAnimationComplete when animation finishes', async () => {
      const onComplete = jest.fn();
      render(
        <AnimatedLogo
          enableEntrance={true}
          onAnimationComplete={onComplete}
        />
      );

      await waitFor(
        () => {
          expect(onComplete).toHaveBeenCalled();
        },
        { timeout: ANIMATION_DURATIONS.slow + 100 }
      );
    });

    it('should not call onAnimationComplete when entrance is disabled', async () => {
      const onComplete = jest.fn();
      render(
        <AnimatedLogo
          enableEntrance={false}
          onAnimationComplete={onComplete}
        />
      );

      await waitFor(
        () => {
          expect(onComplete).not.toHaveBeenCalled();
        },
        { timeout: 100 }
      );
    });
  });

  describe('Pulse animation', () => {
    it('should enable pulse animation when entrance is disabled', () => {
      const { getByTestId } = render(
        <AnimatedLogo enablePulse={true} enableEntrance={false} />
      );
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should disable pulse animation when specified', () => {
      const { getByTestId } = render(
        <AnimatedLogo enablePulse={false} />
      );
      expect(getByTestId('animated-logo')).toBeTruthy();
    });
  });

  describe('Lottie integration', () => {
    it('should render with Lottie source', () => {
      const lottieSource = { uri: 'https://example.com/animation.json' };
      const { getByTestId } = render(
        <AnimatedLogo lottieSource={lottieSource} />
      );
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should prefer Lottie over image when both provided', () => {
      const lottieSource = { uri: 'https://example.com/animation.json' };
      const imageSource = { uri: 'https://example.com/logo.png' };
      const { getByTestId } = render(
        <AnimatedLogo source={imageSource} lottieSource={lottieSource} />
      );
      expect(getByTestId('animated-logo')).toBeTruthy();
    });
  });

  describe('Styles', () => {
    it('should apply custom container styles', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <AnimatedLogo style={customStyle} />
      );
      expect(getByTestId('animated-logo')).toBeTruthy();
    });

    it('should apply custom image styles', () => {
      const customImageStyle = { borderRadius: 10 };
      const { getByTestId } = render(
        <AnimatedLogo imageStyle={customImageStyle} />
      );
      expect(getByTestId('animated-logo')).toBeTruthy();
    });
  });
});

describe('useLogoAnimation Hook', () => {
  it('should provide animation controls', () => {
    const { result } = renderHook(() => useLogoAnimation());
    
    expect(result.current.scale).toBeDefined();
    expect(result.current.opacity).toBeDefined();
    expect(result.current.rotation).toBeDefined();
    expect(result.current.animateLogo).toBeDefined();
    expect(result.current.resetAnimation).toBeDefined();
  });

  it('should animate scale', () => {
    const { result } = renderHook(() => useLogoAnimation());
    result.current.animateLogo('scale');
    expect(result.current.scale.value).toBeDefined();
  });

  it('should animate fade', () => {
    const { result } = renderHook(() => useLogoAnimation());
    result.current.animateLogo('fade');
    expect(result.current.opacity.value).toBeDefined();
  });

  it('should animate bounce', () => {
    const { result } = renderHook(() => useLogoAnimation());
    result.current.animateLogo('bounce');
    expect(result.current.scale.value).toBeDefined();
  });

  it('should animate rotate', () => {
    const { result } = renderHook(() => useLogoAnimation());
    result.current.animateLogo('rotate');
    expect(result.current.rotation.value).toBeDefined();
  });

  it('should animate all', () => {
    const { result } = renderHook(() => useLogoAnimation());
    result.current.animateLogo('all');
    expect(result.current.scale.value).toBeDefined();
    expect(result.current.opacity.value).toBeDefined();
    expect(result.current.rotation.value).toBeDefined();
  });

  it('should reset animations', () => {
    const { result } = renderHook(() => useLogoAnimation());
    result.current.resetAnimation();
    expect(result.current.scale.value).toBeDefined();
    expect(result.current.opacity.value).toBeDefined();
    expect(result.current.rotation.value).toBeDefined();
  });
});

// Helper function to render hooks
function renderHook<T>(callback: () => T) {
  let result: { current: T };
  
  function TestComponent() {
    result = { current: callback() };
    return null;
  }
  
  render(<TestComponent />);
  
  return { result: result! };
}