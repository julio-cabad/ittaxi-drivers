import React from 'react';
import { Keyboard, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, DatePicker, AppText, FormField } from '../../commons';
import { itPrimary, itDarkGray } from '../../../utils/colors';
import { getMaxBirthDate, getMinBirthDate } from '../../../utils/dateHelpers';
import { PersonalDataFormContentProps } from '../../../types/onboarding';
import { authStyles } from '../../../styles/components/auth';
import tw from 'twrnc';

const PersonalDataFormContent: React.FC<PersonalDataFormContentProps> = ({
  formik,
  onSubmit,
  loading = false,
}) => {
  const handleSubmit = async () => {
    Keyboard.dismiss();

    // Marcar todos los campos como tocados para mostrar errores
    formik.setTouched({
      firstName: true,
      lastName: true,
      phoneNumber: true,
      birthDate: true,
      city: true,
      address: true,
      'emergencyContact.name': true,
      'emergencyContact.phoneNumber': true,
      'emergencyContact.relationship': true,
    });

    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      console.log('❌ Validation errors:', errors);
      return;
    }

    if (formik.isValid && !formik.isSubmitting) {
      if (onSubmit) {
        await onSubmit(formik.values);
      } else {
        // Fallback to formik.handleSubmit if no onSubmit provided
        formik.handleSubmit();
      }
    }
  };

  return (
    <View style={tw`w-full`}>
      {/* Sección: Datos Personales */}
      <AppText
        fontSize={18}
        fontWeight="600"
        color={itDarkGray}
        style={tw`mb-4 mt-2`}
      >
        📋 Información personal
      </AppText>

      <FormField
        name="firstName"
        label="Nombre"
        autoCapitalize="words"
        leftIcon={<Icon name="person" size={20} color={itPrimary} />}
        size="medium"
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
        label="Celular"
        keyboardType="phone-pad"
        leftIcon={<Icon name="phone" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      <DatePicker
        name="birthDate"
        label="Fecha de Nacimiento"
        required
        maxDate={getMaxBirthDate()}
        minDate={getMinBirthDate()}
        leftIcon={<Icon name="calendar-today" size={20} color={itPrimary} />}
        size="small"
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      {/* Sección: Dirección */}
      <AppText
        fontSize={18}
        fontWeight="600"
        color={itDarkGray}
        style={tw`mb-4 mt-4`}
      >
        📍 Dirección
      </AppText>

      <FormField
        name="city"
        label="Ciudad"
        autoCapitalize="words"
        leftIcon={<Icon name="location-city" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
      />

      <FormField
        name="address"
        label="Dirección Completa"
        leftIcon={<Icon name="location-on" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
        containerStyle={tw`mt-2`}
      />

      {/* Sección: Contacto de Emergencia */}
      <AppText
        fontSize={18}
        fontWeight="600"
        color={itDarkGray}
        style={tw`mb-4 mt-4`}
      >
        🚨 Contacto de emergencia
      </AppText>

      <FormField
        name="emergencyContact.name"
        label="Nombre Completo"
        autoCapitalize="words"
        leftIcon={<Icon name="contact-emergency" size={20} color={itPrimary} />}
        size="medium"
        height={50}
        showSuccessIndicator={true}
      />

      <FormField
        name="emergencyContact.phoneNumber"
        label="Celular"
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
        loading={loading}
        disabled={!formik.isValid || formik.isSubmitting || loading}
        onPress={handleSubmit}
        style={authStyles.registerButton}
        testID="personal-data-submit-button"
      >
        {loading ? 'Guardando...' : 'Continuar'}
      </Button>
    </View>
  );
};

export default PersonalDataFormContent;
