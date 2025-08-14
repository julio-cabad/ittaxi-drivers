import * as Yup from 'yup';
import { strings } from '../constants/strings';

// Base validation rules - reutilizables
export const ValidationRules = {
  email: Yup.string()
    .email(strings.validation.email.invalid)
    .required(strings.validation.email.required),
    
  password: Yup.string()
    .min(8, strings.validation.password.minLength)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      strings.validation.password.pattern
    )
    .required(strings.validation.password.required),
    
  confirmPassword: (fieldName: string = 'password') => 
    Yup.string()
      .oneOf([Yup.ref(fieldName)], strings.validation.password.match)
      .required(strings.validation.password.required),
      
  name: Yup.string()
    .min(2, strings.validation.name.minLength)
    .max(50, strings.validation.name.maxLength)
    .required(strings.validation.name.required),
    
  phone: Yup.string()
    .matches(/^\+?[\d\s\-\()]+$/, strings.validation.phone.invalid)
    .min(10, strings.validation.phone.minLength)
    .required(strings.validation.phone.required),
};

// Esquemas específicos para cada pantalla
export const AuthSchemas = {
  login: Yup.object().shape({
    email: ValidationRules.email,
    password: Yup.string().required(strings.validation.password.required), // Menos estricto para login
  }),
  
  register: Yup.object().shape({
    email: ValidationRules.email,
    password: ValidationRules.password,
    confirmPassword: ValidationRules.confirmPassword(),
  }),
  
  forgotPassword: Yup.object().shape({
    email: ValidationRules.email,
  }),
};

// Valores iniciales para formularios
export const InitialValues = {
  login: {
    email: '',
    password: '',
  },
  
  register: {
    email: '',
    password: '',
    confirmPassword: '',
  },
  
  forgotPassword: {
    email: '',
  },
};