import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button, DatePicker } from '../../commons';
import { itPrimary } from '../../../utils/colors';
import { getMaxBirthDate, getMinBirthDate } from '../../../utils/dateHelpers';
import {
  PersonalDataFormContentProps,
} from '../../../types/personalData';
import tw from 'twrnc';



const PersonalDataFormContent: React.FC<PersonalDataFormContentProps> = ({
  formik,
}) => {


  const handleSubmit = () => {
    console.log('🔴 PersonalDataFormContent: Botón presionado');
    console.log('🔴 PersonalDataFormContent: formik.values:', formik.values);
    console.log('🔴 PersonalDataFormContent: formik.errors:', formik.errors);
    console.log('🔴 PersonalDataFormContent: formik.isValid:', formik.isValid);
    formik.handleSubmit();
  };

  return (
    <View style={tw`w-full`}>
      {/* Información Personal */}
      <Text style={tw`text-lg font-semibold text-gray-800 mb-4`}>Información Personal</Text>

      <Input
        name="firstName"
        label="Nombre"
        placeholder="Ingresa tu nombre"
        autoCapitalize="words"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        leftIcon={<Icon name="person" size={20} color={itPrimary} />}
      />

      <Input
        name="lastName"
        label="Apellido"
        placeholder="Ingresa tu apellido"
        autoCapitalize="words"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        leftIcon={<Icon name="person-outline" size={20} color={itPrimary} />}
      />

      <Input
        name="phoneNumber"
        label="Teléfono"
        placeholder="+593987654321 o 0987654321"
        keyboardType="phone-pad"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        leftIcon={<Icon name="phone" size={20} color={itPrimary} />}
      />

      <DatePicker
        label="Fecha de Nacimiento"
        value={formik.values.birthDate}
        onDateSelect={(date) => formik.setFieldValue('birthDate', date)}
        placeholder="Selecciona tu fecha de nacimiento"
        error={formik.touched.birthDate && formik.errors.birthDate ? formik.errors.birthDate : undefined}
        required
        maxDate={getMaxBirthDate()}
        minDate={getMinBirthDate()}
      />
      {/* Dirección */}
      <Text style={tw`text-lg font-semibold text-gray-800 mb-4 mt-6`}>Dirección</Text>

      <Input
        name="city"
        label="Ciudad"
        placeholder="Ingresa tu ciudad"
        autoCapitalize="words"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        leftIcon={<Icon name="location-city" size={20} color={itPrimary} />}
      />

      <Input
        name="address"
        label="Dirección"
        placeholder="Calle, número"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        leftIcon={<Icon name="location-on" size={20} color={itPrimary} />}
      />

      {/* Contacto de Emergencia */}
      <Text style={tw`text-lg font-semibold text-gray-800 mb-4 mt-6`}>Contacto de Emergencia</Text>

      <Input
        name="emergencyContact.name"
        label="Nombre Completo"
        placeholder="Nombre del contacto de emergencia"
        autoCapitalize="words"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        leftIcon={<Icon name="contact-emergency" size={20} color={itPrimary} />}
      />

      <Input
        name="emergencyContact.phoneNumber"
        label="Teléfono"
        placeholder="+593987654321 o 0987654321"
        keyboardType="phone-pad"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        leftIcon={<Icon name="phone" size={20} color={itPrimary} />}
      />

      <Input
        name="emergencyContact.relationship"
        label="Relación"
        placeholder="Ej: Padre, Madre, Esposo/a, Hermano/a"
        autoCapitalize="words"
        errorStyle={tw`text-xs text-red-500`}
        style={tw`mb-3`}
        labelStyle={tw`text-gray-600 text-sm`}
        leftIcon={<Icon name="family-restroom" size={20} color={itPrimary} />}
      />
      {/* Submit Button */}
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

export default PersonalDataFormContent;


