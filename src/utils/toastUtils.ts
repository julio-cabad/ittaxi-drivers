import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom';
  autoHide?: boolean;
}

// Success toasts
export const showSuccessToast = (
  title: string,
  message?: string,
  duration: number = 3000
): void => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    visibilityTime: duration,
    position: 'top',
    topOffset: 60, // Move toast down from top
  });
};

// Error toasts
export const showErrorToast = (
  title: string,
  message?: string,
  duration: number = 4000
): void => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    visibilityTime: duration,
    position: 'top',
    topOffset: 60, // Move toast down from top
  });
};

// Info toasts
export const showInfoToast = (
  title: string,
  message?: string,
  duration: number = 3000
): void => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    visibilityTime: duration,
    position: 'top',
    topOffset: 60, // Move toast down from top
  });
};

// Warning toasts
export const showWarningToast = (
  title: string,
  message?: string,
  duration: number = 3500
): void => {
  Toast.show({
    type: 'error', // react-native-toast-message doesn't have warning, use error with custom styling
    text1: title,
    text2: message,
    visibilityTime: duration,
    position: 'top',
    topOffset: 60, // Move toast down from top
  });
};

// Generic toast
export const showToast = (config: ToastConfig): void => {
  Toast.show({
    type: config.type,
    text1: config.title,
    text2: config.message,
    visibilityTime: config.duration || 3000,
    position: config.position || 'top',
    topOffset: 60, // Move toast down from top
    autoHide: config.autoHide !== false,
  });
};

// Hide current toast
export const hideToast = (): void => {
  Toast.hide();
};

// Onboarding specific toasts
export const OnboardingToasts = {
  dataSaved: () => showSuccessToast('Datos guardados', 'Tu progreso se ha guardado automáticamente'),

  stepCompleted: (stepName: string) =>
    showSuccessToast('Paso completado', `${stepName} completado correctamente`),

  validationError: (message: string) =>
    showErrorToast('Datos incompletos', message),

  uploadProgress: (fileName: string) =>
    showInfoToast('Subiendo archivo', `Subiendo ${fileName}...`),

  uploadSuccess: (fileName: string) =>
    showSuccessToast('Archivo subido', `${fileName} se subió correctamente`),

  uploadError: (fileName: string) =>
    showErrorToast('Error al subir', `No se pudo subir ${fileName}`),

  syncError: () =>
    showErrorToast('Error de sincronización', 'Algunos cambios no se pudieron guardar'),

  offlineMode: () =>
    showWarningToast('Modo offline', 'Los cambios se sincronizarán cuando tengas conexión'),

  backOnline: () =>
    showSuccessToast('Conectado', 'Sincronizando cambios...'),

  submissionSuccess: () =>
    showSuccessToast('¡Solicitud enviada!', 'Tu solicitud está siendo revisada'),

  submissionError: () =>
    showErrorToast('Error al enviar', 'No se pudo enviar tu solicitud'),

  statusUpdate: (status: string) =>
    showInfoToast('Estado actualizado', `Tu solicitud está ${status}`),

  documentRequired: (docName: string) =>
    showWarningToast('Documento requerido', `Necesitas subir tu ${docName}`),

  photoRequired: (photoName: string) =>
    showWarningToast('Foto requerida', `Necesitas tomar la foto ${photoName}`),
};

// Network status toasts
export const NetworkToasts = {
  connectionLost: () =>
    showWarningToast('Sin conexión', 'Trabajando en modo offline'),

  connectionRestored: () =>
    showSuccessToast('Conectado', 'Conexión restaurada'),

  slowConnection: () =>
    showInfoToast('Conexión lenta', 'La subida puede tardar más de lo normal'),
};

// Form validation toasts
export const ValidationToasts = {
  requiredField: (fieldName: string) =>
    showErrorToast('Campo requerido', `${fieldName} es obligatorio`),

  invalidFormat: (fieldName: string) =>
    showErrorToast('Formato inválido', `${fieldName} no tiene el formato correcto`),

  fileTooLarge: (maxSize: string) =>
    showErrorToast('Archivo muy grande', `El archivo debe ser menor a ${maxSize}`),

  invalidFileType: (allowedTypes: string) =>
    showErrorToast('Tipo de archivo inválido', `Solo se permiten archivos ${allowedTypes}`),

  formValid: () =>
    showSuccessToast('Formulario válido', 'Todos los datos están correctos'),
};