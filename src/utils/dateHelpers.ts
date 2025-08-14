// Utilidades para manejo de fechas

/**
 * Calcula la fecha máxima permitida para fecha de nacimiento (18 años atrás)
 */
export const getMaxBirthDate = (): string => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return maxDate.toISOString().split('T')[0];
};

/**
 * Calcula la fecha mínima permitida para fecha de nacimiento (100 años atrás)
 */
export const getMinBirthDate = (): string => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  return minDate.toISOString().split('T')[0];
};

/**
 * Valida si una fecha está en el formato correcto YYYY-MM-DD
 */
export const isValidDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

/**
 * Calcula la edad basada en la fecha de nacimiento
 */
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
