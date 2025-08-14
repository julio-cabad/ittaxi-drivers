import React from 'react';
import { View, Text } from 'react-native';
import { FormikProps } from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button } from '../../commons';
import { VehicleData } from '../../../types/onboarding';
import { itPrimary } from '../../../utils/colors';
import tw from 'twrnc';

interface VehicleDataFormContentProps {
  formik: FormikProps<VehicleData>;
}

const VehicleDataFormContent: React.FC<VehicleDataFormContentProps> = ({ formik }) => {
  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <View style={tw`w-full`}>
      <Text style={tw`text-lg font-semibold text-gray-800 mb-4`}>Información del Vehículo</Text>

      <Input
        name="make"
        label="Marca"
        placeholder="Ej: Toyota"
        autoCapitalize="words"
        leftIcon={<Icon name="directions-car" size={20} color={itPrimary} />}
        style={tw`mb-3`}
      />
      <Input
        name="model"
        label="Modelo"
        placeholder="Ej: Corolla"
        autoCapitalize="words"
        leftIcon={<Icon name="style" size={20} color={itPrimary} />}
        style={tw`mb-3`}
      />
      <Input
        name="year"
        label="Año"
        placeholder="Ej: 2022"
        keyboardType="numeric"
        leftIcon={<Icon name="calendar-today" size={20} color={itPrimary} />}
        style={tw`mb-3`}
      />
      <Input
        name="licensePlate"
        label="Matrícula"
        placeholder="Ej: ABC1234"
        autoCapitalize="characters"
        leftIcon={<Icon name="pin" size={20} color={itPrimary} />}
        style={tw`mb-3`}
      />
      <Input
        name="color"
        label="Color"
        placeholder="Ej: Rojo"
        autoCapitalize="words"
        leftIcon={<Icon name="color-lens" size={20} color={itPrimary} />}
        style={tw`mb-3`}
      />

      <Button
        variant="primary"
        size="large"
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        onPress={handleSubmit}
        style={tw`mt-8`}
      >
        {formik.isSubmitting ? 'Guardando' : 'Continuar'}
      </Button>
    </View>
  );
};

export default VehicleDataFormContent;
