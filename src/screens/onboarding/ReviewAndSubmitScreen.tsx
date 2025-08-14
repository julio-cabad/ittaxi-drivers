import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { SCREEN_NAMES } from '../../constants/navigation';
import { ScreenWrapper } from '../../components/layout';
import { Button } from '../../components/commons';
import { commonStyles } from '../../styles';
import { useOnboarding } from '../../hooks/useOnboarding';
import tw from 'twrnc';

const ReviewAndSubmitScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveProgress, getProgress } = useOnboarding();
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // 🎯 Registrar que llegamos al Step 5 SOLO si no hay datos previos
  useEffect(() => {
    const registerStepProgress = async () => {
      if (hasAutoSaved) return;
      setHasAutoSaved(true);
      
      const existingProgress = await getProgress();
      
      // ✅ CORREGIDO: Solo auto-guardar si NO hay datos específicos de revisión
      if (!existingProgress || !existingProgress.userData?.review) {
        console.log('🎯 ReviewAndSubmitScreen: Registrando llegada al Step 5 (sin datos de revisión)');
        const emptyReviewData = {
          reviewCompleted: false,
          submissionDate: null,
        };
        await saveProgress(5, emptyReviewData);
      } else {
        console.log('🎯 ReviewAndSubmitScreen: Ya hay datos de revisión guardados, no sobrescribir');
      }
    };

    registerStepProgress();
  }, [saveProgress, hasAutoSaved, getProgress]);

  const handleSubmit = () => {
    navigation.navigate(SCREEN_NAMES.ONBOARDING.PENDING_REVIEW);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={[tw`text-3xl mb-8 font-bold text-center`, commonStyles.primaryText]}>
          Revisar y Enviar
        </Text>
        <Text style={[tw`text-base mb-8 text-center`, commonStyles.grayText]}>
          Revisa toda tu información antes de enviar
        </Text>

        <View style={tw`w-full max-w-sm`}>
          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            style={tw`mb-4`}
          >
            Enviar Solicitud
          </Button>
          
          <Button
            variant="outline"
            size="large"
            onPress={handleBack}
          >
            Atrás
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ReviewAndSubmitScreen;