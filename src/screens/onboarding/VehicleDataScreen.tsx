import React from 'react';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { AuthScreenWrapper } from '../../components/layout';
import { FormWrapper, VehicleDataFormContent } from '../../components/forms';
import { useOnboarding } from '../../hooks/useOnboarding';
import { vehicleDataValidationSchema } from '../../utils/validations';
import { VehicleData } from '../../types/onboarding';
import { RootState } from '../../store';
import { SCREEN_NAMES } from '../../constants';
import { showSuccessToast } from '../../utils/toastUtils';
import { loginStyles, complexLoginStyles } from '../auth/Login/Login.styles';

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
    <AuthScreenWrapper>
      <View style={loginStyles.headerSection}>
        <View style={loginStyles.welcomeTextContainer}>
          <Text style={complexLoginStyles.welcomeTitle}>
            Datos del Vehículo
          </Text>
        </View>
      </View>

      <View style={[loginStyles.formCard, complexLoginStyles.formCard, { minHeight: 500 }]}>
        <View style={complexLoginStyles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={complexLoginStyles.logo}
            resizeMode="contain"
          />
        </View>

        <FormWrapper
          initialValues={initialValues}
          validationSchema={vehicleDataValidationSchema}
          onSubmit={handleFormSubmit}
          scrollEnabled={true}
        >
          {formik => <VehicleDataFormContent formik={formik} />}
        </FormWrapper>
      </View>
    </AuthScreenWrapper>
  );
};

export default VehicleDataScreen;
