import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { ScreenWrapper } from '../../components/layout';
import { Button } from '../../components/commons';
import { commonStyles } from '../../styles';
import { useOnboarding } from '../../hooks/useOnboarding';
import tw from 'twrnc';

const DriverStatusScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveProgress, getProgress } = useOnboarding();
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // 🎯 Registrar que llegamos al Step 7 SOLO si no hay datos previos
  useEffect(() => {
    const registerStepProgress = async () => {
      if (hasAutoSaved) return;
      setHasAutoSaved(true);
      
      const existingProgress = await getProgress();
      
      // ✅ CORREGIDO: Solo auto-guardar si NO hay datos específicos de status
      if (!existingProgress || !existingProgress.userData?.status) {
        console.log('🎯 DriverStatusScreen: Registrando llegada al Step 7 (sin datos de status)');
        const emptyStatusData = {
          onboardingCompleted: true,
          driverStatus: 'active',
          completedAt: new Date().toISOString(),
        };
        await saveProgress(7, emptyStatusData);
      } else {
        console.log('🎯 DriverStatusScreen: Ya hay datos de status guardados, no sobrescribir');
      }
    };

    registerStepProgress();
  }, [saveProgress, hasAutoSaved, getProgress]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={[tw`text-3xl mb-8 font-bold text-center`, commonStyles.primaryText]}>
          Estado del Conductor
        </Text>
        <Text style={[tw`text-base mb-8 text-center`, commonStyles.grayText]}>
          Aquí puedes ver el estado actual de tu solicitud
        </Text>

        <View style={tw`w-full max-w-sm`}>
          <Button
            variant="outline"
            size="large"
            onPress={handleGoBack}
          >
            Volver
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default DriverStatusScreen;