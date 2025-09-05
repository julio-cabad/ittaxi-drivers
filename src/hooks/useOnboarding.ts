import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
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
    personal: any;
    vehicle: any;
    documents: any;
    photos: any;
  };
}

export const useOnboarding = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const onboardingState = useSelector((state: RootState) => state.onboarding);

  /**
   * Obtiene la clave de datos según el paso
   */
  const getStepDataKey = useCallback((step: number): string => {
    switch (step) {
      case 1:
        return 'personal';
      case 2:
        return 'vehicle';
      case 3:
        return 'documents';
      case 4:
        return 'photos';
      default:
        return 'misc';
    }
  }, []);

  /**
   * Guarda el progreso del onboarding en Realm y Firestore
   */
  const saveProgress = useCallback(
    async (
      step: number,
      stepData?: any,
      options?: { skipFirestore?: boolean },
    ): Promise<{ success: boolean; error?: string }> => {
      if (!user?.uid) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      try {
        const stepDataObject = stepData && { [getStepDataKey(step)]: stepData };

        // ✅ OBTENER DATOS EXISTENTES PRIMERO
        const realmData = await realmService.getOnboardingData(user.uid);
        const newUserData = {
          ...realmData?.userData,
          ...stepDataObject,
        };

        const progressData: Partial<OnboardingState> = {
          currentStep: step,
          completedSteps: [
            ...(onboardingState.completedSteps || []),
            step,
          ].filter((v, i, a) => a.indexOf(v) === i),
          progress: Math.round((step / ONBOARDING_STEPS.TOTAL) * 100),
          userData: newUserData,
          lastSavedAt: new Date().toISOString(),
          syncStatus: 'pending',
        };

        // 1. Guardar en Realm (local, rápido)

        await realmService.saveOnboardingData(user.uid, progressData);

        // 2. Guardar en Firestore (remoto, puede fallar)
        if (!options?.skipFirestore) {
          try {
            await firebaseService.setDocument('onboarding_progress', user.uid, {
              ...progressData,
              updatedAt: firebaseService.getServerTimestamp(),
            });

            // Marcar como sincronizado en Realm
            await realmService.markAsSynced(user.uid);
          } catch (firestoreError) {
            throw new Error(
              `Firestore error: ${
                firestoreError instanceof Error
                  ? firestoreError.message
                  : 'Error desconocido'
              }`,
            );
          }
        }

        // 3. Actualizar Redux (opcional, para UI reactiva)
        dispatch(updateOnboardingProgress(progressData));

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        };
      }
    },
    [user?.uid, onboardingState, dispatch, getStepDataKey],
  );

  /**
   * Recupera el progreso del onboarding (Realm primero, luego Firestore)
   */
  const getProgress =
    useCallback(async (): Promise<OnboardingProgress | null> => {
      if (!user?.uid) {
        return null;
      }

      try {
        // 1. Intentar Realm primero (más rápido)
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

        const firestoreDoc = await firebaseService.getDocument(
          'onboarding_progress',
          user.uid,
        );

        if (firestoreDoc?.exists && firestoreDoc.data) {
          // Guardar en Realm para próximas consultas
          await realmService.saveOnboardingData(user.uid, firestoreDoc.data);

          return {
            userId: user.uid,
            currentStep: firestoreDoc.data.currentStep,
            completedSteps: firestoreDoc.data.completedSteps || [],
            lastSavedAt:
              firestoreDoc.data.lastSavedAt || new Date().toISOString(),
            userData: firestoreDoc.data.userData,
          };
        }

        return null;
      } catch (error) {
        return null;
      }
    }, [user?.uid]);

  /**
   * Guarda datos en el step especificado pero actualiza currentStep al siguiente
   */
  const saveStepDataAndAdvance = useCallback(
    async (
      dataStep: number,
      stepData: any,
      nextStep: number,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!user?.uid) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      try {
        const progressData: Partial<OnboardingState> = {
          currentStep: nextStep, // El step al que queremos ir
          completedSteps: [
            ...(onboardingState.completedSteps || []),
            dataStep,
          ].filter((v, i, a) => a.indexOf(v) === i),
          progress: Math.round((nextStep / ONBOARDING_STEPS.TOTAL) * 100),
          userData: {
            personal: null,
            vehicle: null,
            documents: null,
            photos: null,
            ...(await realmService.getOnboardingData(user.uid))?.userData,
            [getStepDataKey(dataStep)]: stepData, // Guardar en la sección correcta
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
    },
    [user?.uid, onboardingState.completedSteps, getStepDataKey, dispatch],
  );

  /**
   * Actualiza solo el currentStep sin modificar userData
   */
  const updateCurrentStep = useCallback(
    async (step: number): Promise<{ success: boolean; error?: string }> => {
      if (!user?.uid) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      try {
        const progressData: Partial<OnboardingState> = {
          currentStep: step,
          completedSteps: [
            ...(onboardingState.completedSteps || []),
            step,
          ].filter((v, i, a) => a.indexOf(v) === i),
          progress: Math.round((step / ONBOARDING_STEPS.TOTAL) * 100),
          userData: onboardingState.userData, // Mantener userData sin cambios
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
    },
    [user?.uid, onboardingState, dispatch],
  );

  /**
   * Limpia todo el progreso (útil para testing)
   */
  const clearProgress = useCallback(async (): Promise<void> => {
    if (!user?.uid) return;

    try {
      await realmService.deleteOnboardingData(user.uid);
      await firebaseService.deleteDocument('onboarding_progress', user.uid);
    } catch (error) {}
  }, [user?.uid]);

  /**
   * Recupera automáticamente el progreso y determina a qué pantalla navegar
   */

  /**
   * Recupera automáticamente el progreso y determina a qué pantalla navegar
   */
  const recoverProgress = useCallback(async (): Promise<{
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
        3: SCREEN_NAMES.ONBOARDING.DOCUMENTS_UPLOAD, // ✅ CORRECTO
        4: SCREEN_NAMES.ONBOARDING.VEHICLE_PHOTOS, // ✅ CORRECTO
        5: SCREEN_NAMES.ONBOARDING.REVIEW_SUBMIT,
        6: SCREEN_NAMES.ONBOARDING.PENDING_REVIEW,
        7: SCREEN_NAMES.ONBOARDING.DRIVER_STATUS, // Onboarding completado
      };

      const targetScreen =
        stepToScreen[progress.currentStep as keyof typeof stepToScreen];

      return {
        shouldNavigate: true,
        targetScreen,
        currentStep: progress.currentStep,
        progress,
      };
    } catch (error) {
      return { shouldNavigate: false };
    }
  }, [user?.uid, getProgress]);

  /**
   * Carga los datos del usuario desde Realm/Firestore y actualiza Redux
   */
  const loadUserData = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!user?.uid) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      const progress = await getProgress();

      if (progress?.userData) {
        // Actualizar Redux con los datos recuperados
        dispatch(
          updateOnboardingProgress({
            currentStep: progress.currentStep,
            completedSteps: progress.completedSteps,
            userData: progress.userData,
            lastSavedAt: progress.lastSavedAt,
            syncStatus: 'synced',
          }),
        );

        return { success: true };
      } else {
        return { success: false, error: 'No hay datos guardados' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }, [user?.uid, getProgress, dispatch]);

  return {
    saveProgress,
    getProgress,
    clearProgress,
    recoverProgress,
    updateCurrentStep,
    saveStepDataAndAdvance,
    loadUserData,
    currentStep: onboardingState.currentStep,
    isCompleted: onboardingState.isCompleted,
    userData: onboardingState.userData,
    isLoading: onboardingState.isLoading,
  };
};
