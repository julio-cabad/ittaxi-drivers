import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'background';
  showParticles?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  variant = 'background',
}) => {
  // Get gradient colors based on variant
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return ['#667eea', '#764ba2'];
      case 'secondary':
        return ['#f093fb', '#f5576c'];
      case 'background':
      default:
        return ['#1c3a69', '#2563eb', '#1e40af'];
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    zIndex: 0,
  },
  particle1: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  particle2: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  particle3: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});

export default AnimatedBackground;
