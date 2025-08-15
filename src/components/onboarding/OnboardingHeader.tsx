/**
 * Reusable header component for onboarding screens
 * Uses the professional HeaderWithBack component with onboarding presets
 */
import React from 'react';
import { HeaderWithBack, HeaderPresets } from '../commons/HeaderWithBack';

export interface OnboardingHeaderProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  variant?: 'normal' | 'compact';
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  variant = 'normal',
}) => {
  const preset = variant === 'compact' 
    ? HeaderPresets.onboardingCompact 
    : HeaderPresets.onboarding;

  return (
    <HeaderWithBack
      title={title}
      subtitle={subtitle}
      showBackButton={showBackButton}
      onBackPress={onBackPress}
      {...preset}
    />
  );
};