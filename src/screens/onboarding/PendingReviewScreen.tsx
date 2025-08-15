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

const PendingReviewScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveProgress, getProgress } = useOnboarding();
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // 🎯 Registrar que llegamos al Step 6 SOLO si no hay datos previos
  useEffect(() => {
    const registerStepProgress = async () => {
      if (hasAutoSaved) return;
      setHasAutoSaved(true);
      
      const existingProgress = await getProgress();
      
      if (!existingProgress || existingProgress.currentStep < 6) {
        console.log('🎯 PendingReviewScreen: Registrando llegada al Step 6');
        const emptyPendingData = {
          submissionCompleted: true,
          reviewStatus: 'pending',
          submittedAt: new Date().toISOString(),
        };
        await saveProgress(6, emptyPendingData);
      } else {
        console.log('🎯 PendingReviewScreen: Ya hay datos guardados, no sobrescribir');
      }
    };

    registerStepProgress();
  }, [saveProgress, hasAutoSaved, getProgress]);

  const handleCheckStatus = () => {
    navigation.navigate(SCREEN_NAMES.ONBOARDING.DRIVER_STATUS);
  };

  return (
    <ScreenWrapper>
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={[tw`text-3xl mb-8 font-bold text-center`, commonStyles.primaryText]}>
          Solicitud Enviada
        </Text>
        <Text style={[tw`text-base mb-8 text-center`, commonStyles.grayText]}>
          Tu solicitud está siendo revisada. Te notificaremos cuando esté lista.
        </Text>

        <View style={tw`w-full max-w-sm`}>
          <Button
            variant="primary"
            size="large"
            onPress={handleCheckStatus}
          >
            Ver Estado
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default PendingReviewScreen;