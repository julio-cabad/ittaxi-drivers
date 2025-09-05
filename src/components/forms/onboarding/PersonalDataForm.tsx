import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, DatePicker } from '../../commons';
import { FormField } from '../../commons/FormField';
import { itPrimary } from '../../../utils/colors';
import { getMaxBirthDate, getMinBirthDate } from '../../../utils/dateHelpers';
import {
  PersonalDataFormContentProps,
} from '../../../types/onboarding';
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
      <FormField
        name="firstName"
        label="Nombre"
        autoCapitalize="words"
        leftIcon={<Icon name="person" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
      />

      <FormField
        name="lastName"
        label="Apellido"
        autoCapitalize="words"
        leftIcon={<Icon name="person-outline" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      <FormField
        name="phoneNumber"
        label="Teléfono"
        keyboardType="phone-pad"
        leftIcon={<Icon name="phone" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
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
      <FormField
        name="city"
        label="Ciudad"
        autoCapitalize="words"
        leftIcon={<Icon name="location-city" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      <FormField
        name="address"
        label="Dirección"
        leftIcon={<Icon name="location-on" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      <FormField
        name="emergencyContact.name"
        label="Nombre Completo"
        autoCapitalize="words"
        leftIcon={<Icon name="contact-emergency" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      <FormField
        name="emergencyContact.phoneNumber"
        keyboardType="phone-pad"
        leftIcon={<Icon name="phone" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      <FormField
        name="emergencyContact.relationship"
        label="Relación"
        autoCapitalize="words"
        leftIcon={<Icon name="family-restroom" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />
      {/* Submit Button */}
      <Button
        variant="primary"
        size="medium"
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


