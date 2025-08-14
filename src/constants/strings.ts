export const strings = {
  // Auth Screens
  auth: {
    login: {
      title: 'Bienvenido de Vuelta',
      subtitle: 'Inicia sesión para continuar en InstaTaxi Conductores',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'Ingresa tu correo electrónico',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Ingresa tu contraseña',
      submitButton: 'Iniciar Sesión',
      submitButtonLoading: 'Iniciando Sesión...',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta? ',
      signUp: 'Regístrate',
    },
    createAccount: {
      title: 'Crear Cuenta',
      subtitle: 'Únete a InstaTaxi Conductores hoy',
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Ingresa tu nombre completo',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'Ingresa tu correo electrónico',
      phoneLabel: 'Número de Teléfono',
      phonePlaceholder: 'Ingresa tu número de teléfono',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Crea una contraseña segura',
      confirmPasswordLabel: 'Confirmar Contraseña',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      submitButton: 'Crear Cuenta',
      submitButtonLoading: 'Creando Cuenta...',
      hasAccount: '¿Ya tienes una cuenta? ',
      signIn: 'Inicia Sesión',
    },
    forgotPassword: {
      title: 'Recuperar Contraseña',
      subtitle: 'Ingresa tu correo para restablecer tu contraseña',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'Ingresa tu correo electrónico',
      submitButton: 'Enviar Enlace',
      submitButtonLoading: 'Enviando...',
      backToLogin: 'Volver al Inicio de Sesión',
      successMessage: '¡Enlace de recuperación enviado a tu correo!',
    },
  },
  
  // Validation Messages
  validation: {
    required: 'Este campo es obligatorio',
    email: {
      invalid: 'Por favor ingresa un correo electrónico válido',
      required: 'El correo electrónico es obligatorio',
    },
    password: {
      required: 'La contraseña es obligatoria',
      minLength: 'La contraseña debe tener al menos 8 caracteres',
      pattern: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      match: 'Las contraseñas deben coincidir',
    },
    name: {
      required: 'El nombre es obligatorio',
      minLength: 'El nombre debe tener al menos 2 caracteres',
      maxLength: 'El nombre debe tener menos de 50 caracteres',
    },
    phone: {
      required: 'El número de teléfono es obligatorio',
      invalid: 'Por favor ingresa un número de teléfono válido',
      minLength: 'El número de teléfono debe tener al menos 10 dígitos',
    },
  },
  
  // Common
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    done: 'Hecho',
    retry: 'Reintentar',
  },
};