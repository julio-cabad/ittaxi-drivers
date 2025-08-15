import React, { useState, useCallback } from 'react';
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
   * Handles form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!areAllDocumentsUploaded()) {
      showErrorToast(
        'Documentos faltantes',
        'Por favor sube todos los documentos requeridos',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare documents data for saving
      const documentsPayload: Partial<DocumentsData> = {
        nationalIdFront: uploadedDocuments.nationalIdFront
          ? {
              id: `national-id-front-${Date.now()}`,
              name: 'National ID Front',
              type: 'image/jpeg',
              size: 0,
              uri: uploadedDocuments.nationalIdFront,
              uploadUrl: uploadedDocuments.nationalIdFront,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        nationalIdBack: uploadedDocuments.nationalIdBack
          ? {
              id: `national-id-back-${Date.now()}`,
              name: 'National ID Back',
              type: 'image/jpeg',
              size: 0,
              uri: uploadedDocuments.nationalIdBack,
              uploadUrl: uploadedDocuments.nationalIdBack,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        driverLicense: uploadedDocuments.driverLicense
          ? {
              id: `driver-license-${Date.now()}`,
              name: 'Driver License',
              type: 'image/jpeg',
              size: 0,
              uri: uploadedDocuments.driverLicense,
              uploadUrl: uploadedDocuments.driverLicense,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
        vehicleRegistration: uploadedDocuments.vehicleRegistration
          ? {
              id: `vehicle-registration-${Date.now()}`,
              name: 'Vehicle Registration',
              type: 'image/jpeg',
              size: 0,
              uri: uploadedDocuments.vehicleRegistration,
              uploadUrl: uploadedDocuments.vehicleRegistration,
              uploadStatus: 'completed',
              uploadProgress: 100,
            }
          : null,
      };

      const result = await saveStepDataAndAdvance(3, documentsPayload, 4);

      if (result.success) {
        showSuccessToast(
          'Documentos guardados',
          'Tus documentos han sido guardados correctamente',
        );
        navigation.navigate(SCREEN_NAMES.ONBOARDING.VEHICLE_PHOTOS);
      } else {
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
              onImageSelected={() => {}} // Handled internally by component
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
              onImageSelected={() => {}} // Handled internally by component
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
              onImageSelected={() => {}} // Handled internally by component
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
              onImageSelected={() => {}} // Handled internally by component
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
