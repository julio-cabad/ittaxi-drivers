export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  nationalId: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface PersonalDataFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  emergencyContact: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

export interface PersonalDataFormContentProps {
  formik: {
    values: PersonalDataFormValues;
    errors: any;
    touched: any;
    isValid: boolean;
    isSubmitting: boolean;
    setFieldValue: (field: string, value: any) => void;
    setTouched: (touched: any) => void;
    validateForm: () => Promise<any>;
    handleSubmit: () => void;
  };
}