import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES } from '../../constants/navigation';
import { AuthScreenWrapper } from '../../components/layout';
import { AppText, Button } from '../../components/commons';
import { ImageUploadField } from '../../components/onboarding/ImageUploadField';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useAuth } from '../../hooks/useAuth';
import { firebaseStorageService } from '../../config/firebaseStorage';
import { VehiclePhotoType } from '../../utils/imageValidation';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import { RootState } from '../../store';
import {
  extractPhotoUrls,
  areAllPhotosUploaded as checkAllPhotosUploaded,
  PhotosData,
  PhotoUploadUrls,
} from '../../types/onboarding';
import { logger } from '../../utils/logger';
import { fileCleanupService } from '../../services/FileCleanupService';
import { loginStyles, complexLoginStyles } from '../auth/Login/Login.styles';
import { authStyles } from '../../styles';
import { itDarkGray } from '../../utils';

const VehiclePhotosScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveStepDataAndAdvance } = useOnboarding();
  const { user } = useAuth();
  const existingPhotos = useSelector(
    (state: RootState) => state.onboarding.userData.photos,
  );

  // Use authenticated user ID instead of onboarding userId
  const userId = user?.uid || null;

  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoUploadUrls>(
    extractPhotoUrls(existingPhotos),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState<
    Set<keyof PhotoUploadUrls>
  >(new Set());
  const [temporaryFiles, setTemporaryFiles] = useState<Set<string>>(new Set());

  /**
   * Load existing photos data on component mount
   */
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        logger.debug('VehiclePhotosScreen: Loading existing photos data');

        if (existingPhotos) {
          const extractedUrls = extractPhotoUrls(existingPhotos);
          setUploadedPhotos(extractedUrls);

          logger.debug('VehiclePhotosScreen: Existing photos loaded', {
            photosCount: Object.values(extractedUrls).filter(Boolean).length,
          });
        }
      } catch (error) {
        logger.error(
          'VehiclePhotosScreen: Failed to load existing photos',
          error,
        );
      }
    };

    loadExistingData();
  }, [existingPhotos]);

  /**
   * Cleans up temporary files
   */
  const cleanupTemporaryFiles = useCallback(async () => {
    try {
      logger.debug('VehiclePhotosScreen: Cleaning up temporary files', {
        count: temporaryFiles.size,
      });

      setTemporaryFiles(new Set());
      logger.debug('VehiclePhotosScreen: Temporary files cleaned up');
    } catch (error) {
      logger.error(
        'VehiclePhotosScreen: Failed to cleanup temporary files',
        error,
      );
    }
  }, [temporaryFiles]);

  /**
   * Adds a temporary file to cleanup list
   */
  const addTemporaryFile = useCallback((fileUri: string) => {
    setTemporaryFiles(prev => new Set(prev).add(fileUri));
    // Register with cleanup service
    fileCleanupService.registerTemporaryFile(fileUri);
  }, []);

  /**
   * Cleanup temporary files on component unmount
   */
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      fileCleanupService.cleanupOldFiles({ maxAge: 0 });
    };
  }, []); // Empty dependency array - only run on mount/unmount

  /**
   * Handles photo upload start
   */
  const handlePhotoUploadStart = useCallback(
    (photoType: keyof PhotoUploadUrls) => {
      setUploadingPhotos(prev => new Set(prev).add(photoType));
    },
    [],
  );

  /**
   * Handles successful photo upload
   */
  const handlePhotoUpload = useCallback(
    (photoType: keyof PhotoUploadUrls, downloadUrl: string) => {
      setUploadedPhotos(prev => ({
        ...prev,
        [photoType]: downloadUrl,
      }));
      setUploadingPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(photoType);
        return newSet;
      });
      showSuccessToast('Foto subida', 'La foto se subió correctamente');
    },
    [],
  );

  /**
   * Handles photo upload error
   */
  const handlePhotoError = useCallback(
    (error: string, photoType?: keyof PhotoUploadUrls) => {
      if (photoType) {
        setUploadingPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoType);
          return newSet;
        });
      }
      showErrorToast('Error al subir foto', error);
    },
    [],
  );

  /**
   * Checks if all required photos are uploaded
   */
  const areAllPhotosUploaded = useCallback((): boolean => {
    return checkAllPhotosUploaded(uploadedPhotos);
  }, [uploadedPhotos]);

  /**
   * Retry logic for failed operations
   */
  const retryOperation = useCallback(
    async (
      operation: () => Promise<any>,
      maxRetries: number = 3,
      delay: number = 1000,
    ): Promise<any> => {
      let lastError: any;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error;
          logger.warn(
            `VehiclePhotosScreen: Attempt ${attempt}/${maxRetries} failed`,
            error,
          );

          if (attempt < maxRetries) {
            await new Promise<void>(resolve =>
              setTimeout(() => resolve(), delay * attempt),
            );
          }
        }
      }

      throw lastError;
    },
    [],
  );

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async () => {
    // Validate all photos are uploaded
    if (!areAllPhotosUploaded()) {
      showErrorToast(
        'Fotos faltantes',
        'Por favor sube todas las fotos requeridas',
      );
      return;
    }

    // Validate no uploads are in progress
    if (uploadingPhotos.size > 0) {
      showErrorToast(
        'Uploads en progreso',
        'Espera a que terminen de subir todas las fotos',
      );
      return;
    }

    // Validate user is authenticated
    if (!userId) {
      showErrorToast(
        'Error de autenticación',
        'Debes iniciar sesión para continuar',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare photos data for saving
      const photosPayload: PhotosData = {
        front: uploadedPhotos.front
          ? {
              id: `vehicle-front-${Date.now()}`,
              name: 'Foto Frontal del Vehículo',
              type: 'frontal',
              uri: uploadedPhotos.front,
              uploadUrl: uploadedPhotos.front,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        back: uploadedPhotos.back
          ? {
              id: `vehicle-back-${Date.now()}`,
              name: 'Foto Posterior del Vehículo',
              type: 'posterior',
              uri: uploadedPhotos.back,
              uploadUrl: uploadedPhotos.back,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        leftSide: uploadedPhotos.leftSide
          ? {
              id: `vehicle-left-${Date.now()}`,
              name: 'Foto Lateral Izquierda del Vehículo',
              type: 'lateral_izquierda',
              uri: uploadedPhotos.leftSide,
              uploadUrl: uploadedPhotos.leftSide,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        rightSide: uploadedPhotos.rightSide
          ? {
              id: `vehicle-right-${Date.now()}`,
              name: 'Foto Lateral Derecha del Vehículo',
              type: 'lateral_derecha',
              uri: uploadedPhotos.rightSide,
              uploadUrl: uploadedPhotos.rightSide,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        interior: uploadedPhotos.interior
          ? {
              id: `vehicle-interior-${Date.now()}`,
              name: 'Foto Interior del Vehículo',
              type: 'interior',
              uri: uploadedPhotos.interior,
              uploadUrl: uploadedPhotos.interior,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
      };

      logger.info('VehiclePhotosScreen: Saving photos data', {
        photosCount: Object.values(photosPayload).filter(Boolean).length,
        userId: userId || 'anonymous',
      });

      // Use retry logic for saving data
      const result = await retryOperation(
        () => saveStepDataAndAdvance(4, photosPayload, 5),
        3, // max retries
        1500, // delay between retries
      );

      if (result.success) {
        logger.info('VehiclePhotosScreen: Photos saved successfully');

        showSuccessToast(
          'Fotos guardadas',
          'Tus fotos han sido guardadas correctamente',
        );

        // Cleanup temporary files
        await cleanupTemporaryFiles();

        // Navigate to next screen with a small delay for better UX
        setTimeout(() => {
          navigation.navigate(SCREEN_NAMES.ONBOARDING.REVIEW_SUBMIT);
        }, 500);
      } else {
        logger.error(
          'VehiclePhotosScreen: Failed to save photos',
          result.error,
        );

        showErrorToast(
          'Error al guardar',
          result.error || 'No se pudieron guardar las fotos',
        );
      }
    } catch (error: any) {
      showErrorToast('Error al guardar', error.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    uploadedPhotos,
    areAllPhotosUploaded,
    saveStepDataAndAdvance,
    navigation,
    cleanupTemporaryFiles,
    retryOperation,
    uploadingPhotos.size,
    userId,
  ]);

  return (
    <AuthScreenWrapper>
      <View style={loginStyles.headerSection}>
        <View style={loginStyles.welcomeTextContainer}>
          <Text style={complexLoginStyles.welcomeTitle}>
            Fotos del Vehículo
          </Text>
        </View>
      </View>

      <View
        style={[
          loginStyles.formCard,
          complexLoginStyles.formCard,
          { minHeight: 500 },
        ]}
      >
        <View style={complexLoginStyles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={complexLoginStyles.logo}
            resizeMode="contain"
          />
        </View>

        <AppText
          fontSize={16}
          fontWeight="600"
          color={itDarkGray}
          style={tw`mb-4`}
        >
          📸 Sube fotos de tu vehículo
        </AppText>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageUploadField
            label="Foto Frontal del Vehículo"
            value={uploadedPhotos.front}
            onImageSelected={addTemporaryFile}
            onUploadStart={() => handlePhotoUploadStart('front')}
            onUploadComplete={url => handlePhotoUpload('front', url)}
            onUploadError={error => handlePhotoError(error, 'front')}
            storagePath={firebaseStorageService.getVehiclePhotoPath(
              userId || 'anonymous',
              VehiclePhotoType.FRONT,
            )}
            placeholder="Toca para subir la foto frontal de tu vehículo"
            aspectRatio={16 / 9}
          />

          <ImageUploadField
            label="Foto Posterior del Vehículo"
            value={uploadedPhotos.back}
            onImageSelected={addTemporaryFile}
            onUploadStart={() => handlePhotoUploadStart('back')}
            onUploadComplete={url => handlePhotoUpload('back', url)}
            onUploadError={error => handlePhotoError(error, 'back')}
            storagePath={firebaseStorageService.getVehiclePhotoPath(
              userId || 'anonymous',
              VehiclePhotoType.BACK,
            )}
            placeholder="Toca para subir la foto posterior de tu vehículo"
            aspectRatio={16 / 9}
          />

          <ImageUploadField
            label="Foto Lateral Izquierda"
            value={uploadedPhotos.leftSide}
            onImageSelected={addTemporaryFile}
            onUploadStart={() => handlePhotoUploadStart('leftSide')}
            onUploadComplete={url => handlePhotoUpload('leftSide', url)}
            onUploadError={error => handlePhotoError(error, 'leftSide')}
            storagePath={firebaseStorageService.getVehiclePhotoPath(
              userId || 'anonymous',
              VehiclePhotoType.LEFT_SIDE,
            )}
            placeholder="Toca para subir la foto del lado izquierdo"
            aspectRatio={16 / 9}
          />

          <ImageUploadField
            label="Foto Lateral Derecha"
            value={uploadedPhotos.rightSide}
            onImageSelected={addTemporaryFile}
            onUploadStart={() => handlePhotoUploadStart('rightSide')}
            onUploadComplete={url => handlePhotoUpload('rightSide', url)}
            onUploadError={error => handlePhotoError(error, 'rightSide')}
            storagePath={firebaseStorageService.getVehiclePhotoPath(
              userId || 'anonymous',
              VehiclePhotoType.RIGHT_SIDE,
            )}
            placeholder="Toca para subir la foto del lado derecho"
            aspectRatio={16 / 9}
          />

          <ImageUploadField
            label="Foto Interior del Vehículo"
            value={uploadedPhotos.interior}
            onImageSelected={addTemporaryFile}
            onUploadStart={() => handlePhotoUploadStart('interior')}
            onUploadComplete={url => handlePhotoUpload('interior', url)}
            onUploadError={error => handlePhotoError(error, 'interior')}
            storagePath={firebaseStorageService.getVehiclePhotoPath(
              userId || 'anonymous',
              VehiclePhotoType.INTERIOR,
            )}
            placeholder="Toca para subir la foto del interior"
            aspectRatio={16 / 9}
          />
        </ScrollView>

        <View style={tw`mt-5`}>
          <Button
            variant="primary"
            size="medium"
            loading={isSubmitting || uploadingPhotos.size > 0}
            onPress={handleSubmit}
            disabled={
              !areAllPhotosUploaded() ||
              isSubmitting ||
              uploadingPhotos.size > 0
            }
            style={authStyles.registerButton}
            testID="vehicle-photos-submit-button"
          >
            {isSubmitting
              ? 'Guardando...'
              : uploadingPhotos.size > 0
              ? `Subiendo ${uploadingPhotos.size} foto${
                  uploadingPhotos.size > 1 ? 's' : ''
                }...`
              : 'Siguiente'}
          </Button>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default VehiclePhotosScreen;