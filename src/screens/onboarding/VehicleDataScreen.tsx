import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { ScreenWrapper } from '../../components/layout';
import { FormWrapper, VehicleDataFormContent } from '../../components/forms';
import { useOnboarding } from '../../hooks/useOnboarding';
import { vehicleDataValidationSchema } from '../../utils/validations';
import { VehicleData, ONBOARDING_STEPS } from '../../types/onboarding';
import { RootState } from '../../store';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES } from '../../constants';
import { onboardingStyles } from '../../styles/onboardingStyles';
import { showSuccessToast } from '../../utils/toastUtils';

const VehicleDataScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveStepDataAndAdvance, saveProgress, getProgress } = useOnboarding();
  const vehicleData = useSelector((state: RootState) => state.onboarding.userData.vehicle);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // 🎯 Registrar que llegamos al Step 2 SOLO si no hay datos previos
  useEffect(() => {
    const registerStepProgress = async () => {
      if (hasAutoSaved) return;
      setHasAutoSaved(true);
      
      // Verificar si ya hay datos guardados
      const existingProgress = await getProgress();
      
      // Solo auto-guardar si NO hay datos previos o si currentStep es menor a 2
      if (!existingProgress || existingProgress.currentStep < 2) {
        console.log('🎯 VehicleDataScreen: Registrando llegada al Step 2 (sin datos previos)');
        const emptyVehicleData = {
          make: '',
          model: '',
          year: new Date().getFullYear(),
          licensePlate: '',
          color: '',
        };
        await saveProgress(2, emptyVehicleData);
      } else {
        console.log('🎯 VehicleDataScreen: Ya hay datos guardados, no sobrescribir');
      }
    };

    registerStepProgress();
  }, [saveProgress, hasAutoSaved]);

  const initialValues: VehicleData = {
    make: vehicleData?.make || '',
    model: vehicleData?.model || '',
    year: vehicleData?.year || new Date().getFullYear(),
    licensePlate: vehicleData?.licensePlate || '',
    color: vehicleData?.color || '',
  };

  const handleFormSubmit = async (data: VehicleData) => {
    const processedData = {
      ...data,
      year: Number(data.year),
    };
    
    const result = await saveStepDataAndAdvance(
      2, // Guardar en step 2 (vehicle)
      processedData,
      3  // Ir a step 3 (documents)
    );

    if (result.success) {
      showSuccessToast('Datos del vehículo guardados', 'Tu información ha sido guardada correctamente');
      navigation.navigate(SCREEN_NAMES.ONBOARDING.DOCUMENTS_UPLOAD);
    }
  };

  return (
    <ScreenWrapper>
      <LinearGradient
        colors={['#1c3a69', '#2563eb', '#1e40af']}
        style={onboardingStyles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={onboardingStyles.headerSection}>
          <View style={onboardingStyles.welcomeTextContainer}>
            <Text style={onboardingStyles.welcomeTitle}>Datos del Vehículo</Text>
            <Text style={onboardingStyles.welcomeSubtitle}>Información del vehículo</Text>
          </View>
        </View>

        <View style={onboardingStyles.formCard}>
          <View style={onboardingStyles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={onboardingStyles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={onboardingStyles.formSubtitle}>
            Completa la información de tu vehículo para continuar
          </Text>

          <FormWrapper
            initialValues={initialValues}
            validationSchema={vehicleDataValidationSchema}
            onSubmit={handleFormSubmit}
            scrollEnabled={true}
          >
            {formik => (
              <VehicleDataFormContent formik={formik} />
            )}
          </FormWrapper>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default VehicleDataScreen;