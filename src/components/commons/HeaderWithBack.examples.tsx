/**
 * Examples of how to use the HeaderWithBack component
 * This file shows different configurations and use cases
 */
import React from 'react';
import { HeaderWithBack, HeaderPresets } from './HeaderWithBack';

// Example 1: Basic onboarding header
export const OnboardingExample = () => (
  <HeaderWithBack
    title="Documentos"
    subtitle="Sube tus documentos legales"
    {...HeaderPresets.onboarding}
  />
);

// Example 2: Compact header for screens with more content
export const CompactExample = () => (
  <HeaderWithBack
    title="Configuración"
    subtitle="Ajusta tus preferencias"
    {...HeaderPresets.onboardingCompact}
  />
);

// Example 3: Centered header for special screens
export const CenteredExample = () => (
  <HeaderWithBack
    title="Bienvenido"
    subtitle="Configura tu perfil"
    {...HeaderPresets.centered}
  />
);

// Example 4: Custom styled header
export const CustomExample = () => (
  <HeaderWithBack
    title="Mi Perfil"
    subtitle="Información personal"
    titleColor="#1f2937"
    subtitleColor="#6b7280"
    backButtonColor="#2563eb"
    backgroundColor="#f8fafc"
    backIconName="close"
    backIconSize={20}
    titleSize={28}
    subtitleSize={16}
    spacing="compact"
    backButtonStyle={{
      backgroundColor: '#e5e7eb',
      borderRadius: 8,
    }}
  />
);

// Example 5: Header without back button
export const NoBackButtonExample = () => (
  <HeaderWithBack
    title="Dashboard"
    subtitle="Resumen de actividad"
    showBackButton={false}
    alignment="center"
    spacing="spacious"
  />
);

// Example 6: Header with custom container styling
export const CustomContainerExample = () => (
  <HeaderWithBack
    title="Notificaciones"
    subtitle="Gestiona tus alertas"
    containerStyle={{
      paddingHorizontal: 32,
      paddingTop: 80,
      paddingBottom: 32,
    }}
    titleStyle={{
      fontFamily: 'System',
      letterSpacing: 0.5,
    }}
    subtitleStyle={{
      fontStyle: 'italic',
    }}
  />
);

// Example 7: Different icon types
export const DifferentIconsExample = () => (
  <>
    <HeaderWithBack
      title="Cerrar"
      backIconName="close"
      showBackButton={true}
    />
    
    <HeaderWithBack
      title="Configuración"
      backIconName="arrow-left"
      showBackButton={true}
    />
    
    <HeaderWithBack
      title="Editar"
      backIconName="arrow-up"
      showBackButton={true}
    />
  </>
);

// Example 8: Usage with custom onBackPress
export const CustomBackActionExample = () => (
  <HeaderWithBack
    title="Formulario"
    subtitle="Completa la información"
    onBackPress={() => {
      // Custom logic here
      console.log('Custom back action');
      // navigation.navigate('SpecificScreen');
    }}
  />
);