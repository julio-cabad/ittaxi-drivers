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

const DocumentsUploadScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { saveProgress, getProgress } = useOnboarding();
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // 🎯 Registrar que llegamos al Step 3 SOLO si no hay datos previos
  useEffect(() => {
    const registerStepProgress = async () => {
      if (hasAutoSaved) return;
      setHasAutoSaved(true);
      
      const existingProgress = await getProgress();
      
      // ✅ CORREGIDO: Solo auto-guardar si NO hay datos específicos de documentos
      if (!existingProgress || !existingProgress.userData?.documents) {
        console.log('🎯 DocumentsUploadScreen: Registrando llegada al Step 3 (sin datos de documentos)');
        const emptyDocumentsData = {
          driverLicense: null,
          vehicleRegistration: null,
          insurance: null,
          criminalRecord: null,
        };
        await saveProgress(3, emptyDocumentsData);
      } else {
        console.log('🎯 DocumentsUploadScreen: Ya hay datos de documentos guardados, no sobrescribir');
      }
    };

    registerStepProgress();
  }, [saveProgress, hasAutoSaved, getProgress]);

  const handleNext = () => {
    navigation.navigate(SCREEN_NAMES.ONBOARDING.REVIEW_SUBMIT);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={[tw`text-3xl mb-8 font-bold text-center`, commonStyles.primaryText]}>
          Subir Documentos
        </Text>
        <Text style={[tw`text-base mb-8 text-center`, commonStyles.grayText]}>
          Sube tus documentos legales requeridos
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

export default DocumentsUploadScreen;