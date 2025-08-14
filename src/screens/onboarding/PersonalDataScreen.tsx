import React from 'react';
import { View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { ScreenWrapper } from '../../components/layout';
import { PersonalDataFormContent } from '../../components/forms';
import { FormWrapper } from '../../components/forms';
import { PersonalDataFormValues } from '../../types/personalData';
import { personalDataValidationSchema, personalDataInitialValues } from '../../utils/validations';
import { useOnboarding } from '../../hooks/useOnboarding';
import { showSuccessToast } from '../../utils/toastUtils';
import { onboardingStyles } from '../../styles/onboardingStyles';
import { SCREEN_NAMES } from '../../constants';

const PersonalDataScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveStepDataAndAdvance } = useOnboarding();
  // ✅ ELIMINADO - No actualizar step automáticamente

  // Manejar envío del formulario
  const handleFormSubmit = async (values: PersonalDataFormValues) => {
    console.log('🚀 Valores del formulario:', values);

    const data = { ...values, status: 'Revisión', isBlocked: false };
    console.log('🚀 Datos del formulario:', data);

    const result = await saveStepDataAndAdvance(1, data, 2);
    console.log('🚀 Resultado del guardado:', result);

    if (result.success) {
      showSuccessToast('Datos guardados', 'Tu información personal ha sido guardada correctamente');
      navigation.navigate(SCREEN_NAMES.ONBOARDING.VEHICLE_DATA);
    }
  };

  return (
    <ScreenWrapper>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1c3a69', '#2563eb', '#1e40af']}
        style={onboardingStyles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header Section */}
        <View style={onboardingStyles.headerSection}>
          <View style={onboardingStyles.welcomeTextContainer}>
            <Text style={onboardingStyles.welcomeTitle}>Datos Personales</Text>
            <Text style={onboardingStyles.welcomeSubtitle}>Información personal</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={onboardingStyles.formCard}>
          {/* Logo inside white card */}
          <View style={onboardingStyles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={onboardingStyles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Subtitle */}
          <Text style={onboardingStyles.formSubtitle}>
            Completa tu información personal para continuar
          </Text>

          {/* Formulario */}
          <FormWrapper
            initialValues={personalDataInitialValues}
            validationSchema={personalDataValidationSchema}
            onSubmit={handleFormSubmit}
            scrollEnabled={true}
          >
            {formik => (
              <PersonalDataFormContent
                formik={formik}
              />
            )}
          </FormWrapper>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default PersonalDataScreen;
