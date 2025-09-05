import React from 'react';
import { Keyboard, View } from 'react-native';
import { FormikProps } from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, AppText, FormField } from '../../commons';
import { VehicleData } from '../../../types/onboarding';
import { itPrimary, itDarkGray } from '../../../utils/colors';
import { authStyles } from '../../../styles/components/auth';
import tw from 'twrnc';

interface VehicleDataFormContentProps {
  formik: FormikProps<VehicleData>;
  onSubmit?: (values: VehicleData) => void;
  loading?: boolean;
}

const VehicleDataFormContent: React.FC<VehicleDataFormContentProps> = ({
  formik,
  onSubmit,
  loading = false,
}) => {
  const handleSubmit = async () => {
    formik.setTouched({
      make: true,
      model: true,
      year: true,
      licensePlate: true,
      color: true,
    });

    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (formik.isValid && !formik.isSubmitting) {
      Keyboard.dismiss();
      if (onSubmit) {
        await onSubmit(formik.values);
      } else {
        formik.handleSubmit();
      }
    }
  };

  return (
    <View style={tw`w-full`}>
      <AppText
        fontSize={18}
        fontWeight="600"
        color={itDarkGray}
        style={tw`mb-4 mt-2`}
      >
        🚗 Información del Vehículo
      </AppText>

      <FormField
        name="make"
        label="Marca"
        autoCapitalize="words"
        leftIcon={<Icon name="directions-car" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
      />
      <FormField
        name="model"
        label="Modelo"
        autoCapitalize="words"
        leftIcon={<Icon name="style" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />
      <FormField
        name="year"
        label="Año"
        keyboardType="numeric"
        leftIcon={<Icon name="calendar-today" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />
      <FormField
        name="licensePlate"
        label="Matrícula"
        autoCapitalize="characters"
        leftIcon={<Icon name="pin" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />
      <FormField
        name="color"
        label="Color"
        autoCapitalize="words"
        leftIcon={<Icon name="color-lens" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      <Button
        variant="primary"
        size="medium"
        loading={loading || formik.isSubmitting}
        disabled={!formik.isValid || formik.isSubmitting || loading}
        onPress={handleSubmit}
        style={authStyles.registerButton}
        testID="vehicle-data-submit-button"
      >
        {loading || formik.isSubmitting ? 'Guardando...' : 'Continuar'}
      </Button>
    </View>
  );
}

export default VehicleDataFormContent;