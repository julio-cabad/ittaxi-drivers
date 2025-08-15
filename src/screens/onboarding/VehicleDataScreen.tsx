import React from 'react';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { ScreenWrapper } from '../../components/layout';
import { FormWrapper, VehicleDataFormContent } from '../../components/forms';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { useOnboarding } from '../../hooks/useOnboarding';
import { vehicleDataValidationSchema } from '../../utils/validations';
import { VehicleData } from '../../types/onboarding';
import { RootState } from '../../store';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES } from '../../constants';
import { onboardingStyles } from '../../styles/onboardingStyles';
import { showSuccessToast } from '../../utils/toastUtils';

const VehicleDataScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveStepDataAndAdvance } = useOnboarding();
  const vehicleData = useSelector(
    (state: RootState) => state.onboarding.userData.vehicle,
  );
  // ✅ ELIMINADO - No auto-guardar datos vacíos

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
      3, // Ir a step 3 (documents)
    );

    if (result.success) {
      showSuccessToast(
        'Datos del vehículo guardados',
        'Tu información ha sido guardada correctamente',
      );
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
        <OnboardingHeader
          title="Datos del Vehículo"
          subtitle="Información del vehículo"
          variant="normal"
        />

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
            {formik => <VehicleDataFormContent formik={formik} />}
          </FormWrapper>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default VehicleDataScreen;
