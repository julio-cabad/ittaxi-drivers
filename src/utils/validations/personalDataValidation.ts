import * as Yup from 'yup';

// Esquema de validación para datos personales
export const personalDataValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
    .required('El nombre es obligatorio'),

  lastName: Yup.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras')
    .required('El apellido es obligatorio'),

  phoneNumber: Yup.string()
    .matches(/^\+593[0-9]{9}$|^0[0-9]{9}$/, 'Formato de teléfono ecuatoriano inválido (+593XXXXXXXXX o 0XXXXXXXXX)')
    .required('El teléfono es obligatorio'),

  birthDate: Yup.string(),
    // .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido')
    // .test('age', 'Debes ser mayor de 18 años', function(value) {
    //   if (!value) return false;
    //   const today = new Date();
    //   const birthDate = new Date(value);
    //   const age = today.getFullYear() - birthDate.getFullYear();
    //   const monthDiff = today.getMonth() - birthDate.getMonth();
      
    //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    //     return age - 1 >= 18;
    //   }
    //   return age >= 18;
    // })
    // .test('not-future', 'La fecha no puede ser futura', function(value) {
    //   if (!value) return false;
    //   const today = new Date();
    //   const birthDate = new Date(value);
    //   return birthDate <= today;
    // })
    // .required('La fecha de nacimiento es obligatoria'),

  address: Yup.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede tener más de 200 caracteres')
    .required('La dirección es obligatoria'),

  city: Yup.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede tener más de 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'La ciudad solo puede contener letras')
    .required('La ciudad es obligatoria'),

  emergencyContact: Yup.object().shape({
    name: Yup.string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede tener más de 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
      .required('El nombre del contacto de emergencia es obligatorio'),

    phoneNumber: Yup.string()
      .matches(/^\+593[0-9]{9}$|^0[0-9]{9}$/, 'Formato de teléfono ecuatoriano inválido (+593XXXXXXXXX o 0XXXXXXXXX)')
      .required('El teléfono del contacto de emergencia es obligatorio'),

    relationship: Yup.string()
      .min(2, 'La relación debe tener al menos 2 caracteres')
      .max(50, 'La relación no puede tener más de 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'La relación solo puede contener letras')
      .required('La relación es obligatoria'),
  }),
});

// Valores iniciales por defecto
export const personalDataInitialValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  birthDate: '',
  address: '',
  city: '',
  state: '',
  emergencyContact: {
    name: '',
    phoneNumber: '',
    relationship: '',
  },
};
