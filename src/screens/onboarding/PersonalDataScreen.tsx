import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { AuthScreenWrapper } from '../../components/layout';
import { PersonalDataFormContent } from '../../components/forms';
import { FormWrapper } from '../../components/forms';
import { PersonalDataFormValues } from '../../types/onboarding';
import { personalDataValidationSchema, personalDataInitialValues } from '../../utils/validations';
import { useOnboarding } from '../../hooks/useOnboarding';
import { showSuccessToast } from '../../utils/toastUtils';
import { logger } from '../../utils/logger';
import { SCREEN_NAMES, strings } from '../../constants';
import { loginStyles, complexLoginStyles } from '../auth/Login/Login.styles';
import tw from 'twrnc';

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
    <AuthScreenWrapper>
      <View style={loginStyles.headerSection}>
        <View style={loginStyles.welcomeTextContainer}>
          <Text style={complexLoginStyles.welcomeTitle}>
            Datos personales
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
    </AuthScreenWrapper>
  );
};

export default PersonalDataScreen;
