import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { ScreenWrapper } from '../../components/layout';
import { PersonalDataFormContent } from '../../components/forms';
import { FormWrapper } from '../../components/forms';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { PersonalDataFormValues } from '../../types/onboarding';
import { personalDataValidationSchema, personalDataInitialValues } from '../../utils/validations';
import { useOnboarding } from '../../hooks/useOnboarding';
import { showSuccessToast } from '../../utils/toastUtils';
import { logger } from '../../utils/logger';
import { onboardingStyles } from '../../styles/onboardingStyles';
import { SCREEN_NAMES } from '../../constants';

const PersonalDataScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveProgress, updateCurrentStep, saveStepDataAndAdvance, getProgress, clearProgress, recoverProgress } = useOnboarding();
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // 🎯 Registrar que llegamos al Step 1 SOLO si no hay datos previos
  useEffect(() => {
    const registerStepProgress = async () => {
      if (hasAutoSaved) return;
      setHasAutoSaved(true);

      // Verificar si ya hay datos guardados
      const existingProgress = await getProgress();

      // Solo auto-guardar si NO hay datos previos o si currentStep es menor a 1
      if (!existingProgress || existingProgress.currentStep < 1) {
        logger.debug('PersonalDataScreen: Registering arrival at Step 1 (no previous data)');
        const emptyPersonalData = {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          birthDate: '',
          address: '',
          city: '',
          emergencyContact: {
            name: '',
            phoneNumber: '',
            relationship: '',
          },
        };
        await saveProgress(1, emptyPersonalData);
      } else {
        logger.debug('PersonalDataScreen: Data already exists, not overwriting');
      }
    };

    registerStepProgress();
  }, [saveProgress, hasAutoSaved, getProgress]);

  // Manejar envío del formulario
  const handleFormSubmit = async (values: PersonalDataFormValues) => {
    logger.debug('Form values submitted', values);

    const data = { ...values, status: 'Revisión', isBlocked: false };
    logger.debug('Form data prepared', data);

    const result = await saveStepDataAndAdvance(1, data, 2);
    logger.debug('Save result', result);

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
        <OnboardingHeader
          title="Datos Personales"
          subtitle="Información personal"
          showBackButton={false}
          variant="normal"
        />

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
