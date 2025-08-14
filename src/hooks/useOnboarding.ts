import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateOnboardingProgress } from '../store/slices/onboarding/onboardingSlice';
import { SCREEN_NAMES } from '../constants';
import { useAuth } from './useAuth';
import { OnboardingState, ONBOARDING_STEPS } from '../types/onboarding';
import { realmService } from '../database/RealmService';
import { firebaseService } from '../services/FirebaseService';

interface OnboardingProgress {
  userId: string;
  currentStep: number;
  completedSteps: number[];
  lastSavedAt: string;
  userData?: {
    personal?: any;
    vehicle?: any;
    documents?: any;
    photos?: any;
  };
}

export const useOnboarding = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const onboardingState = useSelector((state: RootState) => state.onboarding);

  /**
   * Guarda datos en el step especificado pero actualiza currentStep al siguiente
   */
  const saveStepDataAndAdvance = async (
    dataStep: number,
    stepData: any,
    nextStep: number,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.uid) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      const progressData: Partial<OnboardingState> = {
        currentStep: nextStep,
        completedSteps: [...(onboardingState.completedSteps || []), dataStep].filter((v, i, a) => a.indexOf(v) === i),
        progress: Math.round((nextStep / ONBOARDING_STEPS.TOTAL) * 100),
        userData: {
          ...onboardingState.userData,
          [getStepDataKey(dataStep)]: stepData,
        },
        lastSavedAt: new Date().toISOString(),
        syncStatus: 'pending',
      };

      // Guardar en Realm y Firestore
      await realmService.saveOnboardingData(user.uid, progressData);
      await firebaseService.setDocument('onboarding_progress', user.uid, {
        ...progressData,
        updatedAt: firebaseService.getServerTimestamp(),
      });
      await realmService.markAsSynced(user.uid);

      // Actualizar Redux
      dispatch(updateOnboardingProgress(progressData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  /**
   * Recupera el progreso del onboarding (Realm primero, luego Firestore)
   */
  const getProgress = async (): Promise<OnboardingProgress | null> => {
    if (!user?.uid) {
      return null;
    }

    try {
      // 1. Intentar Realm primero
      const realmData = await realmService.getOnboardingData(user.uid);
      
      if (realmData && realmData.currentStep) {
        return {
          userId: user.uid,
          currentStep: realmData.currentStep,
          completedSteps: realmData.completedSteps || [],
          lastSavedAt: realmData.lastSavedAt || new Date().toISOString(),
          userData: realmData.userData,
        };
      }

      // 2. Si no hay en Realm, buscar en Firestore
      const firestoreDoc = await firebaseService.getDocument('onboarding_progress', user.uid);
      
      if (firestoreDoc?.exists && firestoreDoc.data) {
        // Guardar en Realm para próximas consultas
        await realmService.saveOnboardingData(user.uid, firestoreDoc.data);
        
        return {
          userId: user.uid,
          currentStep: firestoreDoc.data.currentStep,
          completedSteps: firestoreDoc.data.completedSteps || [],
          lastSavedAt: firestoreDoc.data.lastSavedAt || new Date().toISOString(),
          userData: firestoreDoc.data.userData,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  /**
   * Obtiene la clave de datos según el paso
   */
  const getStepDataKey = (step: number): string => {
    switch (step) {
      case 1: return 'personal';
      case 2: return 'vehicle';
      case 3: return 'documents';
      case 4: return 'photos';
      default: return 'misc';
    }
  };

  /**
   * Limpia todo el progreso
   */
  const clearProgress = async (): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      await realmService.deleteOnboardingData(user.uid);
      await firebaseService.deleteDocument('onboarding_progress', user.uid);
    } catch (error) {}
  };

  /**
   * Recupera automáticamente el progreso y determina a qué pantalla navegar
   */
  const recoverProgress = async (): Promise<{
    shouldNavigate: boolean;
    targetScreen?: string;
    currentStep?: number;
    progress?: OnboardingProgress;
  }> => {
    if (!user?.uid) {
      return { shouldNavigate: false };
    }

    try {
      const progress = await getProgress();
      
      if (!progress || !progress.currentStep) {
        return { shouldNavigate: false };
      }

      // Mapear step a pantalla correspondiente
      const stepToScreen = {
        1: SCREEN_NAMES.ONBOARDING.PERSONAL_DATA,
        2: SCREEN_NAMES.ONBOARDING.VEHICLE_DATA,
        3: SCREEN_NAMES.ONBOARDING.DOCUMENTS_UPLOAD,
        4: SCREEN_NAMES.ONBOARDING.VEHICLE_PHOTOS,
        5: SCREEN_NAMES.ONBOARDING.REVIEW_SUBMIT,
        6: SCREEN_NAMES.ONBOARDING.PENDING_REVIEW,
        7: SCREEN_NAMES.ONBOARDING.DRIVER_STATUS,
      };

      const targetScreen = stepToScreen[progress.currentStep as keyof typeof stepToScreen];

      return {
        shouldNavigate: true,
        targetScreen,
        currentStep: progress.currentStep,
        progress,
      };
    } catch (error) {
      return { shouldNavigate: false };
    }
  };

  return {
    getProgress,
    clearProgress,
    recoverProgress,
    saveStepDataAndAdvance,
    currentStep: onboardingState.currentStep,
    isCompleted: onboardingState.isCompleted,
  };
};