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
   * Guarda el progreso del onboarding en Realm y Firestore
   */
  const saveProgress = async (
    step: number,
    stepData?: any,
    options?: { skipFirestore?: boolean },
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.uid) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      console.log('🔧 saveProgress DEBUG:');
      console.log('  - step:', step);
      console.log('  - stepData:', stepData);
      console.log('  - getStepDataKey(step):', getStepDataKey(step));
      console.log(
        '  - onboardingState COMPLETO:',
        JSON.stringify(onboardingState, null, 2),
      );
      console.log(
        '  - onboardingState.userData ANTES:',
        JSON.stringify(onboardingState.userData, null, 2),
      );

      const stepDataObject = stepData && { [getStepDataKey(step)]: stepData };
      console.log('  - stepDataObject:', stepDataObject);

      // ✅ OBTENER DATOS EXISTENTES PRIMERO
      const existingProgress = await getProgress();
      const newUserData = {
        ...existingProgress?.userData,
        ...stepDataObject,
      };
      console.log('  - newUserData DESPUÉS:', newUserData);

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

      console.log('  - progressData final:', progressData);

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
          console.warn(
            '⚠️ Error sincronizando con Firestore (continuando con Realm):',
            firestoreError,
          );
          // No fallar si Firestore falla, Realm es suficiente
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
  };

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
      console.log('🚀 saveStepDataAndAdvance DEBUG:');
      console.log('  - dataStep:', dataStep, '(donde guardar datos)');
      console.log('  - stepData:', stepData);
      console.log('  - nextStep:', nextStep, '(currentStep final)');
      console.log('  - getStepDataKey(dataStep):', getStepDataKey(dataStep));

      const progressData: Partial<OnboardingState> = {
        currentStep: nextStep, // El step al que queremos ir
        completedSteps: [
          ...(onboardingState.completedSteps || []),
          dataStep,
        ].filter((v, i, a) => a.indexOf(v) === i),
        progress: Math.round((nextStep / ONBOARDING_STEPS.TOTAL) * 100),
        userData: {
          ...(await getProgress())?.userData,
          [getStepDataKey(dataStep)]: stepData, // Guardar en la sección correcta
        },
        lastSavedAt: new Date().toISOString(),
        syncStatus: 'pending',
      };

      console.log('  - progressData final:', progressData);

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
   * Actualiza solo el currentStep sin modificar userData
   */
  const updateCurrentStep = async (
    step: number,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.uid) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      console.log('🔄 updateCurrentStep DEBUG:');
      console.log('  - step:', step);
      console.log(
        '  - onboardingState.userData ANTES:',
        onboardingState.userData,
      );

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

      console.log('  - progressData final:', progressData);

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
      console.log('⚠️ getProgress: No user.uid');
      return null;
    }

    try {
      console.log('🔍 getProgress: Buscando en Realm para user:', user.uid);
      // 1. Intentar Realm primero (más rápido)
      const realmData = await realmService.getOnboardingData(user.uid);
      console.log('📊 Realm data:', realmData);

      if (realmData && realmData.currentStep) {
        console.log(
          '✅ Progreso encontrado en Realm, step:',
          realmData.currentStep,
        );
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

      console.log('ℹ️ No se encontró progreso guardado');
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
  };

  /**
   * Limpia todo el progreso (útil para testing)
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
      console.log('🔍 recoverProgress: Iniciando recuperación...');
      const progress = await getProgress();
      console.log('📊 Progress obtenido:', progress);

      if (!progress || !progress.currentStep) {
        console.log('⚠️ recoverProgress: No hay progreso o currentStep');
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
  };

  return {
    saveProgress,
    getProgress,
    clearProgress,
    recoverProgress,
    updateCurrentStep,
    saveStepDataAndAdvance,
    currentStep: onboardingState.currentStep,
    isCompleted: onboardingState.isCompleted,
  };
};
