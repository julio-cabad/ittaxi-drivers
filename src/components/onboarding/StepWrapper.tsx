import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenWrapper } from '../layout';
import { useOnboarding } from '../../hooks';
import { itPrimary } from '../../utils/colors';

interface StepWrapperProps {
  stepNumber: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showProgress?: boolean;
  autoSave?: boolean;
  onStepEnter?: () => void;
  onStepExit?: () => void;
}

/**
 * StepWrapper - Componente base para todos los pasos del onboarding
 * Maneja la lógica común: progreso, auto-save, navegación, etc.
 */
const StepWrapper: React.FC<StepWrapperProps> = ({
  stepNumber,
  title,
  subtitle,
  children,
  showProgress = true,
  autoSave = true,
  onStepEnter,
  onStepExit,
}) => {
  const { updateCurrentStep, getProgress } = useOnboarding();
  const [isInitializing, setIsInitializing] = useState(true);

  // Registrar llegada al paso
  useEffect(() => {
    const initializeStep = async () => {
      try {
        setIsInitializing(true);
        
        // Actualizar step actual si es necesario
        const currentProgress = await getProgress();
        if (!currentProgress || currentProgress.currentStep < stepNumber) {
          await updateCurrentStep(stepNumber);
        }
        
        // Callback de entrada al paso
        onStepEnter?.();
        
        console.log(`📍 Entered step ${stepNumber}: ${title}`);
      } catch (error) {
        console.error(`Error initializing step ${stepNumber}:`, error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeStep();

    // Cleanup al salir del paso
    return () => {
      onStepExit?.();
    };
  }, [stepNumber, title, updateCurrentStep, getProgress, onStepEnter, onStepExit]);

  // Mostrar loading mientras inicializa
  if (isInitializing) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={itPrimary} />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Background Gradient */}
        <LinearGradient
          colors={['#1c3a69', '#2563eb', '#1e40af']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            {showProgress && (
              <View style={styles.progressContainer}>
                <Text style={styles.stepNumber}>Paso {stepNumber}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(stepNumber / 8) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            )}
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && (
                <Text style={styles.subtitle}>{subtitle}</Text>
              )}
            </View>
          </View>

          {/* Content Card */}
          <View style={styles.contentCard}>
            {children}
          </View>
        </LinearGradient>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },

  // Background
  gradientBackground: {
    flex: 1,
    backgroundColor: itPrimary,
  },

  // Header Section
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  
  // Progress
  progressContainer: {
    marginBottom: 24,
  },
  stepNumber: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },

  // Title
  titleContainer: {
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'left',
    lineHeight: 24,
  },

  // Content Card
  contentCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: '70%',
    flex: 1,
  },
});

export default StepWrapper;