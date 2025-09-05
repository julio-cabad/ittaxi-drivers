import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES } from '../../constants/navigation';
import { AuthScreenWrapper } from '../../components/layout';
import { AppText, Button } from '../../components/commons';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useAuth } from '../../hooks/useAuth';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import { logger } from '../../utils/logger';
import { loginStyles, complexLoginStyles } from '../auth/Login/Login.styles';
import { authStyles } from '../../styles';
import { itDarkGray } from '../../utils';
import { strings } from '../../constants';

const ReviewAndSubmitScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const {
    saveProgress,
    getProgress,
    userData,
    clearProgress,
    loadUserData,
    isLoading,
  } = useOnboarding();
  const { user } = useAuth();
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 🔄 Cargar datos del usuario al montar el componente
  useEffect(() => {
    console.log('-=-=-=-=-=-=-=-=-=-===', userData)
    const initializeData = async () => {
      try {
        setIsLoadingData(true);
        console.log('🔄 ReviewAndSubmitScreen: Iniciando carga de datos...');
        console.log('🔄 ReviewAndSubmitScreen: userData ANTES:', userData);

        // Verificar que el usuario esté autenticado
        if (!user?.uid) {
          console.log(
            '❌ ReviewAndSubmitScreen: Usuario no autenticado, esperando...',
          );
          setIsLoadingData(false);
          return;
        }

        // Cargar datos desde Realm/Firestore a Redux
        console.log('🚀 ReviewAndSubmitScreen: Llamando loadUserData...');
        const loadResult = await loadUserData();
        console.log(
          '🚀 ReviewAndSubmitScreen: loadUserData RESULTADO:',
          loadResult,
        );

        if (loadResult.success) {
          console.log('✅ ReviewAndSubmitScreen: Datos cargados exitosamente');
        } else {
          console.log(
            '⚠️ ReviewAndSubmitScreen: No se pudieron cargar datos:',
            loadResult.error,
          );
        }
      } catch (error) {
        console.error(
          '❌ ReviewAndSubmitScreen: Error inicializando datos:',
          error,
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    // Solo ejecutar si no tenemos datos en Redux
    if (!userData.personal) {
      initializeData();
    } else {
      setIsLoadingData(false);
    }
  }, [loadUserData, userData, user]); // Ejecutar cuando el usuario se autentique

  // 🎯 Registrar que llegamos al Step 5 SOLO si no hay datos previos
  useEffect(() => {
    const registerStepProgress = async () => {
      if (hasAutoSaved || isLoadingData) return;
      setHasAutoSaved(true);

      const existingProgress = await getProgress();

      if (!existingProgress || existingProgress.currentStep < 5) {
        console.log('🎯 ReviewAndSubmitScreen: Registrando llegada al Step 5');
        const emptyReviewData = {
          reviewCompleted: false,
          submissionDate: null,
        };
        await saveProgress(5, emptyReviewData);
      } else {
        console.log(
          '🎯 ReviewAndSubmitScreen: Ya hay datos guardados, no sobrescribir',
        );
      }
    };

    // Solo ejecutar después de que los datos se hayan cargado
    if (!isLoadingData && !hasAutoSaved) {
      registerStepProgress();
    }
  }, [isLoadingData, hasAutoSaved, saveProgress, getProgress]); // Dependencias mínimas

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the userData to your backend
      // For now, we'll simulate a successful submission
      logger.info('ReviewAndSubmitScreen: Submitting application', {
        userData,
      });

      // Simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

      // Clear local onboarding progress after successful submission
      await clearProgress();

      showSuccessToast(
        strings.onboarding.reviewAndSubmit.success.submissionSuccess,
        strings.onboarding.reviewAndSubmit.success.submissionSuccessMessage,
      );
      navigation.navigate(SCREEN_NAMES.ONBOARDING.PENDING_REVIEW);
    } catch (error: any) {
      logger.error(
        'ReviewAndSubmitScreen: Failed to submit application',
        error,
      );
      showErrorToast(
        strings.onboarding.reviewAndSubmit.error.submissionError,
        error.message ||
          strings.onboarding.reviewAndSubmit.error.submissionErrorMessage,
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [userData, clearProgress, navigation]);

  // Mostrar loading mientras se cargan los datos
  if (isLoadingData || isLoading) {
    return (
      <AuthScreenWrapper>
        <View
          style={[
            loginStyles.formCard,
            complexLoginStyles.formCard,
            { minHeight: 500, justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <AppText
            fontSize={16}
            fontWeight="600"
            color={itDarkGray}
            style={tw`mb-4`}
          >
            Cargando información...
          </AppText>
        </View>
      </AuthScreenWrapper>
    );
  }

  // Validar que tenemos los datos necesarios
  if (!userData || !userData.personal) {
    return (
      <AuthScreenWrapper>
        <View
          style={[
            loginStyles.formCard,
            complexLoginStyles.formCard,
            { minHeight: 500, justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <AppText
            fontSize={16}
            fontWeight="600"
            color={itDarkGray}
            style={tw`mb-4 text-center`}
          >
            No se pudieron cargar los datos del onboarding.
          </AppText>
          <Button
            variant="secondary"
            size="medium"
            onPress={() =>
              navigation.navigate(SCREEN_NAMES.ONBOARDING.PERSONAL_DATA)
            }
            style={tw`mt-4`}
          >
            Volver al inicio
          </Button>
        </View>
      </AuthScreenWrapper>
    );
  }

  return (
    <AuthScreenWrapper>
      <View style={loginStyles.headerSection}>
        <View style={loginStyles.welcomeTextContainer}>
          <Text style={complexLoginStyles.welcomeTitle}>
            {strings.onboarding.reviewAndSubmit.title}
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
          {strings.onboarding.reviewAndSubmit.subtitle}
        </AppText>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={tw`flex-1 w-full`}
        >
          {/* Personal Data Summary */}
          <AppText
            fontSize={18}
            fontWeight="600"
            color={itDarkGray}
            style={tw`mb-2 mt-4`}
          >
            {strings.onboarding.reviewAndSubmit.sections.personalData}
          </AppText>
          <Text style={tw`text-gray-700 mb-2`}>
            Nombre: {userData.personal?.firstName} {userData.personal?.lastName}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Teléfono: {userData.personal?.phone || userData.personal?.phoneNumber}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Fecha de Nacimiento: {userData.personal?.dateOfBirth}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Ciudad: {userData.personal?.city}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Dirección: {userData.personal?.address}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Contacto de Emergencia: {userData.personal?.emergencyContact?.name}{' '}
            ({userData.personal?.emergencyContact?.relationship}) -{' '}
            {userData.personal?.emergencyContact?.phone}
          </Text>

          {/* Vehicle Data Summary */}
          <AppText
            fontSize={18}
            fontWeight="600"
            color={itDarkGray}
            style={tw`mb-2 mt-4`}
          >
            {strings.onboarding.reviewAndSubmit.sections.vehicleData}
          </AppText>
          <Text style={tw`text-gray-700 mb-2`}>
            Marca: {userData.vehicle?.make}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Modelo: {userData.vehicle?.model}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Año: {userData.vehicle?.year}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Matrícula: {userData.vehicle?.licensePlate}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Color: {userData.vehicle?.color}
          </Text>

          {/* Documents Summary */}
          <AppText
            fontSize={18}
            fontWeight="600"
            color={itDarkGray}
            style={tw`mb-2 mt-4`}
          >
            {strings.onboarding.reviewAndSubmit.sections.documents}
          </AppText>
          <Text style={tw`text-gray-700 mb-2`}>
            Cédula Frontal:{' '}
            {userData.documents?.nationalIdFront?.uploadUrl
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Cédula Trasera:{' '}
            {userData.documents?.nationalIdBack?.uploadUrl
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Licencia de Conducir:{' '}
            {userData.documents?.driverLicense?.uploadUrl
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Matrícula del Vehículo:{' '}
            {userData.documents?.vehicleRegistration?.uploadUrl
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>

          {/* Vehicle Photos Summary */}
          <AppText
            fontSize={18}
            fontWeight="600"
            color={itDarkGray}
            style={tw`mb-2 mt-4`}
          >
            {strings.onboarding.reviewAndSubmit.sections.vehiclePhotos}
          </AppText>
          <Text style={tw`text-gray-700 mb-2`}>
            Foto Frontal:{' '}
            {userData.photos?.front
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Foto Posterior:{' '}
            {userData.photos?.back
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Foto Lateral Izquierda:{' '}
            {userData.photos?.leftSide
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Foto Lateral Derecha:{' '}
            {userData.photos?.rightSide
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>
          <Text style={tw`text-gray-700 mb-2`}>
            Foto Interior:{' '}
            {userData.photos?.interior
              ? strings.onboarding.reviewAndSubmit.documentStatus.uploaded
              : strings.onboarding.reviewAndSubmit.documentStatus.notUploaded}
          </Text>
        </ScrollView>

        <View style={tw`mt-5 w-full`}>
          <Button
            variant="primary"
            size="medium"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={authStyles.registerButton}
            testID="submit-application-button"
          >
            {isSubmitting
              ? strings.onboarding.reviewAndSubmit.button.submitting
              : strings.onboarding.reviewAndSubmit.button.submit}
          </Button>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default ReviewAndSubmitScreen;
