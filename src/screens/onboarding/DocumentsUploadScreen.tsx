import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES } from '../../constants/navigation';
import { ScreenWrapper } from '../../components/layout';
import { Button } from '../../components/commons';
import { ImageUploadField } from '../../components/onboarding/ImageUploadField';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { useOnboarding } from '../../hooks/useOnboarding';
import { firebaseStorageService } from '../../config/firebaseStorage';
import { DocumentType } from '../../utils/imageValidation';
import { onboardingStyles } from '../../styles/onboardingStyles';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import { RootState } from '../../store';
import {
  extractDocumentUrls,
  areAllDocumentsUploaded as checkAllDocumentsUploaded,
  DocumentsData,
  DocumentUploadUrls,
} from '../../types/onboarding';
import { logger } from '../../utils/logger';
import { APP_CONFIG } from '../../config/constants';
import { fileCleanupService } from '../../services/FileCleanupService';
import { useDocumentsPersistence } from '../../hooks/useDocumentsPersistence';

const DocumentsUploadScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveStepDataAndAdvance } = useOnboarding();
  const existingDocuments = useSelector(
    (state: RootState) => state.onboarding.userData.documents,
  );
  const userId = useSelector((state: RootState) => state.onboarding.userId);

  const [uploadedDocuments, setUploadedDocuments] =
    useState<DocumentUploadUrls>(extractDocumentUrls(existingDocuments));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState<
    Set<keyof DocumentUploadUrls>
  >(new Set());
  const [temporaryFiles, setTemporaryFiles] = useState<Set<string>>(new Set());

  // Persistence hook for auto-save
  const {
    saveDocuments: persistDocuments,
  } = useDocumentsPersistence({
    userId,
    enableAutoSave: true,
    autoSaveInterval: APP_CONFIG.onboarding.autoSaveInterval,
  });

  /**
   * Load existing documents data on component mount
   */
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        logger.debug('DocumentsUploadScreen: Loading existing documents data');

        if (existingDocuments) {
          const extractedUrls = extractDocumentUrls(existingDocuments);
          setUploadedDocuments(extractedUrls);

          logger.debug('DocumentsUploadScreen: Existing documents loaded', {
            documentsCount: Object.values(extractedUrls).filter(Boolean).length,
          });
        }
      } catch (error) {
        logger.error(
          'DocumentsUploadScreen: Failed to load existing documents',
          error,
        );
      }
    };

    loadExistingData();
  }, [existingDocuments]);

  /**
   * Cleans up temporary files
   */
  const cleanupTemporaryFiles = useCallback(async () => {
    try {
      logger.debug('DocumentsUploadScreen: Cleaning up temporary files', {
        count: temporaryFiles.size,
      });

      // Clean up temporary files from device cache
      for (const fileUri of temporaryFiles) {
        try {
          // React Native doesn't have built-in file deletion
          // but we clear the reference to allow garbage collection
          logger.debug('Removing temporary file reference', { fileUri });
        } catch (err) {
          logger.warn('Failed to remove temporary file', {
            fileUri,
            error: err,
          });
        }
      }

      setTemporaryFiles(new Set());
      logger.debug('DocumentsUploadScreen: Temporary files cleaned up');
    } catch (error) {
      logger.error(
        'DocumentsUploadScreen: Failed to cleanup temporary files',
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
      cleanupTemporaryFiles();
      // Stop file cleanup service for this session
      fileCleanupService.cleanupOldFiles({ maxAge: 0 });
    };
  }, [cleanupTemporaryFiles]);

  /**
   * Auto-save documents when they change
   */
  useEffect(() => {
    if (Object.values(uploadedDocuments).some(Boolean)) {
      persistDocuments(uploadedDocuments).catch(error => {
        logger.error('Failed to persist documents', error);
      });
    }
  }, [uploadedDocuments, persistDocuments]);

  /**
   * Handles document upload start
   */
  const handleDocumentUploadStart = useCallback(
    (documentType: keyof DocumentUploadUrls) => {
      setUploadingDocuments(prev => new Set(prev).add(documentType));
    },
    [],
  );

  /**
   * Handles successful document upload
   */
  const handleDocumentUpload = useCallback(
    (documentType: keyof DocumentUploadUrls, downloadUrl: string) => {
      setUploadedDocuments(prev => ({
        ...prev,
        [documentType]: downloadUrl,
      }));
      setUploadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentType);
        return newSet;
      });
      showSuccessToast(
        'Documento subido',
        'El documento se subió correctamente',
      );
    },
    [],
  );

  /**
   * Handles document upload error
   */
  const handleDocumentError = useCallback(
    (error: string, documentType?: keyof DocumentUploadUrls) => {
      if (documentType) {
        setUploadingDocuments(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentType);
          return newSet;
        });
      }
      showErrorToast('Error al subir documento', error);
    },
    [],
  );

  /**
   * Checks if all required documents are uploaded
   */
  const areAllDocumentsUploaded = useCallback((): boolean => {
    return checkAllDocumentsUploaded(uploadedDocuments);
  }, [uploadedDocuments]);

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
            `DocumentsUploadScreen: Attempt ${attempt}/${maxRetries} failed`,
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
    // Validate all documents are uploaded
    if (!areAllDocumentsUploaded()) {
      showErrorToast(
        'Documentos faltantes',
        'Por favor sube todos los documentos requeridos',
      );
      return;
    }

    // Validate no uploads are in progress
    if (uploadingDocuments.size > 0) {
      showErrorToast(
        'Uploads en progreso',
        'Espera a que terminen de subir todos los documentos',
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
      // Prepare documents data for saving
      const documentsPayload: DocumentsData = {
        nationalIdFront: uploadedDocuments.nationalIdFront
          ? {
              id: `national-id-front-${Date.now()}`,
              name: 'Cédula de Identidad (Frontal)',
              type: 'image/jpeg',
              size: 0, // TODO: Get actual file size
              uri: uploadedDocuments.nationalIdFront,
              uploadUrl: uploadedDocuments.nationalIdFront,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        nationalIdBack: uploadedDocuments.nationalIdBack
          ? {
              id: `national-id-back-${Date.now()}`,
              name: 'Cédula de Identidad (Posterior)',
              type: 'image/jpeg',
              size: 0, // TODO: Get actual file size
              uri: uploadedDocuments.nationalIdBack,
              uploadUrl: uploadedDocuments.nationalIdBack,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        driverLicense: uploadedDocuments.driverLicense
          ? {
              id: `driver-license-${Date.now()}`,
              name: 'Licencia de Conducir',
              type: 'image/jpeg',
              size: 0, // TODO: Get actual file size
              uri: uploadedDocuments.driverLicense,
              uploadUrl: uploadedDocuments.driverLicense,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        vehicleRegistration: uploadedDocuments.vehicleRegistration
          ? {
              id: `vehicle-registration-${Date.now()}`,
              name: 'Matrícula del Vehículo',
              type: 'image/jpeg',
              size: 0, // TODO: Get actual file size
              uri: uploadedDocuments.vehicleRegistration,
              uploadUrl: uploadedDocuments.vehicleRegistration,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
      };

      logger.info('DocumentsUploadScreen: Saving documents data', {
        documentsCount: Object.values(documentsPayload).filter(Boolean).length,
        userId: userId || 'anonymous',
      });

      // Use retry logic for saving data
      const result = await retryOperation(
        () => saveStepDataAndAdvance(3, documentsPayload, 4),
        3, // max retries
        1500, // delay between retries
      );

      if (result.success) {
        logger.info('DocumentsUploadScreen: Documents saved successfully');

        showSuccessToast(
          'Documentos guardados',
          'Tus documentos han sido guardados correctamente',
        );

        // Cleanup temporary files
        await cleanupTemporaryFiles();

        // Navigate to next screen with a small delay for better UX
        setTimeout(() => {
          navigation.navigate(SCREEN_NAMES.ONBOARDING.VEHICLE_PHOTOS);
        }, 500);
      } else {
        logger.error(
          'DocumentsUploadScreen: Failed to save documents',
          result.error,
        );

        showErrorToast(
          'Error al guardar',
          result.error || 'No se pudieron guardar los documentos',
        );
      }
    } catch (error: any) {
      showErrorToast('Error al guardar', error.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    uploadedDocuments,
    areAllDocumentsUploaded,
    saveStepDataAndAdvance,
    navigation,
    cleanupTemporaryFiles,
    retryOperation,
    uploadingDocuments.size,
    userId,
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <LinearGradient
        colors={['#1c3a69', '#2563eb', '#1e40af']}
        style={onboardingStyles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header Section */}
        <OnboardingHeader
          title="Documentos"
          subtitle="Sube tus documentos"
          onBackPress={handleBack}
          variant="normal"
        />

        {/* Form Card */}
        <View style={onboardingStyles.formCard}>
          {/* Logo */}
          <View style={onboardingStyles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={onboardingStyles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Subtitle */}
          <Text style={onboardingStyles.formSubtitle}>
            Sube los siguientes documentos para verificar tu identidad
          </Text>

          {/* Document Upload Fields */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={tw`max-h-[400px]`}
          >
            <ImageUploadField
              label="Cédula de Identidad (Frontal)"
              value={uploadedDocuments.nationalIdFront}
              onImageSelected={addTemporaryFile}
              onUploadStart={() => handleDocumentUploadStart('nationalIdFront')}
              onUploadComplete={url =>
                handleDocumentUpload('nationalIdFront', url)
              }
              onUploadError={error =>
                handleDocumentError(error, 'nationalIdFront')
              }
              storagePath={firebaseStorageService.getDocumentPath(
                userId || 'anonymous',
                DocumentType.NATIONAL_ID_FRONT,
              )}
              placeholder="Toca para subir la parte frontal de tu cédula"
              aspectRatio={16 / 10}
            />

            <ImageUploadField
              label="Cédula de Identidad (Posterior)"
              value={uploadedDocuments.nationalIdBack}
              onImageSelected={addTemporaryFile}
              onUploadStart={() => handleDocumentUploadStart('nationalIdBack')}
              onUploadComplete={url =>
                handleDocumentUpload('nationalIdBack', url)
              }
              onUploadError={error =>
                handleDocumentError(error, 'nationalIdBack')
              }
              storagePath={firebaseStorageService.getDocumentPath(
                userId || 'anonymous',
                DocumentType.NATIONAL_ID_BACK,
              )}
              placeholder="Toca para subir la parte posterior de tu cédula"
              aspectRatio={16 / 10}
            />

            <ImageUploadField
              label="Licencia de Conducir"
              value={uploadedDocuments.driverLicense}
              onImageSelected={addTemporaryFile}
              onUploadStart={() => handleDocumentUploadStart('driverLicense')}
              onUploadComplete={url =>
                handleDocumentUpload('driverLicense', url)
              }
              onUploadError={error =>
                handleDocumentError(error, 'driverLicense')
              }
              storagePath={firebaseStorageService.getDocumentPath(
                userId || 'anonymous',
                DocumentType.DRIVER_LICENSE,
              )}
              placeholder="Toca para subir tu licencia de conducir"
              aspectRatio={16 / 10}
            />

            <ImageUploadField
              label="Matrícula del Vehículo"
              value={uploadedDocuments.vehicleRegistration}
              onImageSelected={addTemporaryFile}
              onUploadStart={() =>
                handleDocumentUploadStart('vehicleRegistration')
              }
              onUploadComplete={url =>
                handleDocumentUpload('vehicleRegistration', url)
              }
              onUploadError={error =>
                handleDocumentError(error, 'vehicleRegistration')
              }
              storagePath={firebaseStorageService.getDocumentPath(
                userId || 'anonymous',
                DocumentType.VEHICLE_REGISTRATION,
              )}
              placeholder="Toca para subir la matrícula de tu vehículo"
              aspectRatio={16 / 10}
            />
          </ScrollView>

          {/* Navigation Button */}
          <View style={tw`mt-5`}>
            <Button
              variant="primary"
              size="large"
              onPress={handleSubmit}
              disabled={
                !areAllDocumentsUploaded() ||
                isSubmitting ||
                uploadingDocuments.size > 0
              }
            >
              {isSubmitting
                ? 'Guardando...'
                : uploadingDocuments.size > 0
                ? `Subiendo ${uploadingDocuments.size} documento${
                    uploadingDocuments.size > 1 ? 's' : ''
                  }...`
                : 'Siguiente'}
            </Button>
          </View>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default DocumentsUploadScreen;
