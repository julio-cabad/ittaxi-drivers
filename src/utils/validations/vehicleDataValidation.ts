import * as Yup from 'yup';

const currentYear = new Date().getFullYear();

export const vehicleDataValidationSchema = Yup.object().shape({
  make: Yup.string().required('La marca del vehículo es obligatoria'),
  model: Yup.string().required('El modelo del vehículo es obligatorio'),
  year: Yup.number()
    .typeError('El año debe ser un número')
    .required('El año del vehículo es obligatorio')
    .min(1980, 'El año debe ser 1980 o posterior')
    .max(currentYear + 1, `El año no puede ser mayor que ${currentYear + 1}`),
  licensePlate: Yup.string()
    .required('La matrícula es obligatoria')
    .matches(/^[A-Z0-9]{3,10}$/, 'Formato de matrícula inválido'),
  color: Yup.string().required('El color del vehículo es obligatorio'),
});
