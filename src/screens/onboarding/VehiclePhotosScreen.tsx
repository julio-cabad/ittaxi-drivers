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

const VehiclePhotosScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveProgress, getProgress } = useOnboarding();
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // 🎯 Registrar que llegamos al Step 4 SOLO si no hay datos previos
  useEffect(() => {
    const registerStepProgress = async () => {
      if (hasAutoSaved) return;
      setHasAutoSaved(true);
      
      const existingProgress = await getProgress();
      
      if (!existingProgress || existingProgress.currentStep < 4) {
        console.log('🎯 VehiclePhotosScreen: Registrando llegada al Step 4');
        const emptyPhotosData = {
          frontPhoto: null,
          backPhoto: null,
          leftSidePhoto: null,
          rightSidePhoto: null,
          interiorPhoto: null,
        };
        await saveProgress(4, emptyPhotosData);
      } else {
        console.log('🎯 VehiclePhotosScreen: Ya hay datos guardados, no sobrescribir');
      }
    };

    registerStepProgress();
  }, [saveProgress, hasAutoSaved, getProgress]);

  const handleNext = () => {
    navigation.navigate(SCREEN_NAMES.ONBOARDING.DOCUMENTS_UPLOAD);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={[tw`text-3xl mb-8 font-bold text-center`, commonStyles.primaryText]}>
          Fotos del Vehículo
        </Text>
        <Text style={[tw`text-base mb-8 text-center`, commonStyles.grayText]}>
          Toma fotos de tu vehículo para verificación
        </Text>

        <View style={tw`w-full max-w-sm`}>
          <Button
            variant="primary"
            size="large"
            onPress={handleNext}
            style={tw`mb-4`}
          >
            Siguiente
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

export default VehiclePhotosScreen;