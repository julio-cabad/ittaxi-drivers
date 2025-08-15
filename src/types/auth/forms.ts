import { FormikProps } from 'formik';
import { LoginFormData, RegisterFormData } from './credentials';

export interface LoginFormContentProps {
  formik: FormikProps<LoginFormData>;
  onSubmit: (values: LoginFormData) => Promise<void>;
  loading?: boolean;
}

export interface RegisterFormContentProps {
  formik: FormikProps<RegisterFormData>;
  onSubmit: (values: RegisterFormData) => Promise<void>;
}