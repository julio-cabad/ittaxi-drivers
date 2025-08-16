/**
 * Modern Animation System
 * Centralized animation configurations and utilities
 */

// Simple animation configuration without complex dependencies for now
export type EasingFunction = (value: number) => number;

// Animation Timings
export const ANIMATION_TIMINGS = {
  // Entrance animations
  ENTRANCE_STAGGER: 100,     // ms between element animations
  ENTRANCE_DURATION: 600,    // Main entrance animation duration
  
  // Micro-interactions
  FOCUS_DURATION: 300,       // Input focus animation
  PRESS_DURATION: 150,       // Button press feedback
  HOVER_DURATION: 200,       // Hover state transitions
  
  // Loading states
  LOADING_DURATION: 1000,    // Loading spinner rotation
  LOADING_MORPH: 400,        // Button morph to loading state
  
  // Feedback animations
  ERROR_SHAKE: 400,          // Error shake animation
  SUCCESS_SCALE: 200,        // Success checkmark animation
  SUCCESS_FADE: 300,         // Success state fade in
  
  // Background animations
  PARTICLE_DURATION: 8000,   // Floating particles cycle
  GRADIENT_SHIFT: 4000,      // Background gradient color shift
} as const;

// Simple easing functions (avoiding complex worklets for now)
export const ANIMATION_EASINGS = {
  // Entrance animations
  ENTRANCE: (t: number) => t * t * (3 - 2 * t), // smoothstep
  ENTRANCE_BOUNCE: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Micro-interactions
  SMOOTH: (t: number) => t * t,
  SNAPPY: (t: number) => t * t * t,
  ELASTIC: (t: number) => t,
  
  // Loading states
  LINEAR: (t: number) => t,
  LOADING: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Feedback
  SHAKE: (t: number) => Math.sin(t * Math.PI),
  BOUNCE: (t: number) => t,
} as const;

// Animation Configuration Interface
export interface AnimationConfig {
  duration: number;
  easing: EasingFunction;
  delay?: number;
  useNativeDriver?: boolean;
}

// Pre-configured Animation Sets
export const ANIMATION_CONFIGS = {
  // Entrance animations
  fadeIn: {
    duration: ANIMATION_TIMINGS.ENTRANCE_DURATION,
    easing: ANIMATION_EASINGS.ENTRANCE,
    useNativeDriver: true,
  },
  slideUp: {
    duration: ANIMATION_TIMINGS.ENTRANCE_DURATION,
    easing: ANIMATION_EASINGS.ENTRANCE,
    useNativeDriver: true,
  },
  scaleIn: {
    duration: ANIMATION_TIMINGS.ENTRANCE_DURATION,
    easing: ANIMATION_EASINGS.ENTRANCE_BOUNCE,
    useNativeDriver: true,
  },
  
  // Micro-interactions
  focus: {
    duration: ANIMATION_TIMINGS.FOCUS_DURATION,
    easing: ANIMATION_EASINGS.SMOOTH,
    useNativeDriver: false, // Color animations need JS thread
  },
  press: {
    duration: ANIMATION_TIMINGS.PRESS_DURATION,
    easing: ANIMATION_EASINGS.SNAPPY,
    useNativeDriver: true,
  },
  
  // Feedback
  shake: {
    duration: ANIMATION_TIMINGS.ERROR_SHAKE,
    easing: ANIMATION_EASINGS.SHAKE,
    useNativeDriver: true,
  },
  success: {
    duration: ANIMATION_TIMINGS.SUCCESS_SCALE,
    easing: ANIMATION_EASINGS.BOUNCE,
    useNativeDriver: true,
  },
} as const;

// Animation Delays for Staggered Entrance
export const getStaggerDelay = (index: number): number => {
  return index * ANIMATION_TIMINGS.ENTRANCE_STAGGER;
};

// Animation Value Ranges
export const ANIMATION_RANGES = {
  // Scale animations
  PRESS_SCALE: 0.95,
  HOVER_SCALE: 1.02,
  SUCCESS_SCALE: 1.1,
  
  // Opacity animations
  HIDDEN: 0,
  VISIBLE: 1,
  DISABLED: 0.5,
  
  // Translation animations
  SLIDE_DISTANCE: 30,
  SHAKE_DISTANCE: 10,
  
  // Rotation animations
  LOADING_ROTATION: 360,
} as const;

// Performance Utilities
export const shouldReduceMotion = (reducedMotion: boolean): boolean => {
  return reducedMotion;
};

export const getOptimizedDuration = (
  baseDuration: number,
  reducedMotion: boolean
): number => {
  return reducedMotion ? baseDuration * 0.3 : baseDuration;
};