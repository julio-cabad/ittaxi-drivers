import Toast from 'react-native-toast-message';
import {
  showErrorToast,
  showWarningToast,
  NetworkToasts,
} from '../utils/toastUtils';

export interface ErrorContext {
  operation: string;
  userId?: string;
  additionalInfo?: any;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}

class ErrorInterceptor {
  // Firebase error codes mapping
  private readonly FIREBASE_ERROR_MESSAGES: Record<string, string> = {
    // Firestore errors
    'permission-denied': 'No tienes permisos para realizar esta acción',
    'not-found': 'El documento solicitado no existe',
    'already-exists': 'El documento ya existe',
    'resource-exhausted': 'Se ha excedido el límite de operaciones',
    'failed-precondition':
      'La operación no se puede completar en el estado actual',
    aborted: 'La operación fue cancelada debido a un conflicto',
    'out-of-range': 'La operación está fuera del rango válido',
    unimplemented: 'Esta operación no está implementada',
    internal: 'Error interno del servidor',
    unavailable: 'El servicio no está disponible temporalmente',
    'data-loss': 'Se ha perdido información crítica',
    unauthenticated: 'Necesitas iniciar sesión para continuar',
    'deadline-exceeded': 'La operación tardó demasiado tiempo',
    cancelled: 'La operación fue cancelada',
    'invalid-argument': 'Los datos proporcionados no son válidos',
    
    // Firebase Auth errors
    'auth/email-already-in-use': 'Esta dirección de correo ya está registrada',
    'auth/invalid-email': 'Por favor ingresa un correo electrónico válido',
    'auth/operation-not-allowed': 'El registro no está disponible temporalmente',
    'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
    'auth/wrong-password': 'La contraseña es incorrecta',
    'auth/invalid-credential': 'Las credenciales proporcionadas son inválidas',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/network-request-failed': 'Verifica tu conexión a internet',
    'auth/requires-recent-login': 'Por seguridad, necesitas iniciar sesión nuevamente',
    'auth/credential-already-in-use': 'Estas credenciales ya están en uso',
    'auth/invalid-verification-code': 'El código de verificación es inválido',
    'auth/invalid-verification-id': 'El ID de verificación es inválido',
    'auth/missing-verification-code': 'Falta el código de verificación',
    'auth/missing-verification-id': 'Falta el ID de verificación',
    'auth/quota-exceeded': 'Se ha excedido la cuota de solicitudes',
    'auth/captcha-check-failed': 'La verificación reCAPTCHA falló',
    'auth/invalid-phone-number': 'El número de teléfono es inválido',
    'auth/missing-phone-number': 'Falta el número de teléfono',
    'auth/invalid-recipient-email': 'El correo del destinatario es inválido',
    'auth/invalid-sender': 'El remitente del correo es inválido',
    'auth/invalid-message-payload': 'El contenido del mensaje es inválido',
    'auth/email-change-needs-verification': 'El cambio de correo requiere verificación',
    'auth/email-already-verified': 'El correo ya está verificado',
  };

  // Network error handling
  private readonly NETWORK_ERROR_MESSAGES: Record<string, string> = {
    'network-request-failed': 'Error de conexión a internet',
    timeout: 'La operación tardó demasiado tiempo',
    'connection-lost': 'Se perdió la conexión a internet',
    'dns-error': 'Error de resolución de DNS',
    'ssl-error': 'Error de certificado SSL',
  };

  // Storage error handling
  private readonly STORAGE_ERROR_MESSAGES: Record<string, string> = {
    'storage/unknown': 'Error desconocido en el almacenamiento',
    'storage/object-not-found': 'El archivo no fue encontrado',
    'storage/bucket-not-found': 'El contenedor de almacenamiento no existe',
    'storage/project-not-found': 'El proyecto no fue encontrado',
    'storage/quota-exceeded': 'Se ha excedido el límite de almacenamiento',
    'storage/unauthenticated': 'No estás autenticado para subir archivos',
    'storage/unauthorized': 'No tienes permisos para subir archivos',
    'storage/retry-limit-exceeded': 'Se excedió el límite de reintentos',
    'storage/invalid-checksum': 'El archivo está corrupto',
    'storage/canceled': 'La subida fue cancelada',
    'storage/invalid-event-name': 'Nombre de evento inválido',
    'storage/invalid-url': 'URL de almacenamiento inválida',
    'storage/invalid-argument': 'Argumento inválido para el almacenamiento',
    'storage/no-default-bucket':
      'No hay contenedor de almacenamiento por defecto',
    'storage/cannot-slice-blob': 'Error al procesar el archivo',
    'storage/server-file-wrong-size': 'El tamaño del archivo no coincide',
  };

  handleError(error: any, context: ErrorContext): ErrorResponse {
    // console.error(`Error in ${context.operation}:`, error);

    // Extract error information
    const errorCode = this.extractErrorCode(error);
    const errorMessage = this.getErrorMessage(errorCode, error);

    // Log error with context
    this.logError(error, context);

    // Show appropriate toast
    this.showErrorToast(errorCode, errorMessage, context);

    // Return structured error response
    return {
      code: errorCode,
      message: errorMessage,
      details: {
        originalError: error,
        context,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private extractErrorCode(error: any): string {
    // Firebase errors
    if (error?.code) {
      return error.code;
    }

    // Network errors
    if (error?.message?.includes('network')) {
      return 'network-request-failed';
    }

    if (error?.message?.includes('timeout')) {
      return 'timeout';
    }

    // Storage errors
    if (error?.message?.includes('storage/')) {
      return (
        error.message.split('storage/')[1]?.split(' ')[0] || 'storage/unknown'
      );
    }

    // Generic errors
    if (error?.name === 'TypeError') {
      return 'invalid-argument';
    }

    if (error?.name === 'ReferenceError') {
      return 'internal';
    }

    return 'unknown';
  }

  private getErrorMessage(errorCode: string, originalError: any): string {
    // Check Firebase errors first
    if (this.FIREBASE_ERROR_MESSAGES[errorCode]) {
      return this.FIREBASE_ERROR_MESSAGES[errorCode];
    }

    // Check network errors
    if (this.NETWORK_ERROR_MESSAGES[errorCode]) {
      return this.NETWORK_ERROR_MESSAGES[errorCode];
    }

    // Check storage errors
    const storageKey = `storage/${errorCode}`;
    if (this.STORAGE_ERROR_MESSAGES[storageKey]) {
      return this.STORAGE_ERROR_MESSAGES[storageKey];
    }

    // Fallback to original error message or generic message
    return originalError?.message || 'Ha ocurrido un error inesperado';
  }

  private showAuthErrorToast(errorCode: string, errorMessage: string): void {
    // Show auth errors with custom positioning (more down from top)
    Toast.show({
      type: 'error',
      text1: 'Error de autenticación',
      text2: errorMessage,
      visibilityTime: 5000,
      position: 'top',
      topOffset: 60, // Move toast down from top
    });
  }

  private showErrorToast(
    errorCode: string,
    errorMessage: string,
    _context: ErrorContext,
  ): void {
    // Network-specific toasts
    if (errorCode === 'network-request-failed' || errorCode === 'unavailable') {
      NetworkToasts.connectionLost();
      return;
    }

    // Permission errors
    if (errorCode === 'permission-denied' || errorCode === 'unauthenticated') {
      showErrorToast('Sin permisos', errorMessage);
      return;
    }

    // Storage errors
    if (errorCode.startsWith('storage/')) {
      showErrorToast('Error de archivo', errorMessage);
      return;
    }

    // Validation errors
    if (
      errorCode === 'invalid-argument' ||
      errorCode === 'failed-precondition'
    ) {
      showWarningToast('Datos inválidos', errorMessage);
      return;
    }

    // Auth-specific errors with better positioning
    if (errorCode.startsWith('auth/')) {
      this.showAuthErrorToast(errorCode, errorMessage);
      return;
    }

    // Generic error
    showErrorToast('Error', errorMessage);
  }

  private logError(error: any, context: ErrorContext): void {
    const logData = {
      timestamp: new Date().toISOString(),
      operation: context.operation,
      userId: context.userId,
      error: {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
      },
      additionalInfo: context.additionalInfo,
    };

    // In production, you might want to send this to a logging service
    // console.error('Structured Error Log:', JSON.stringify(logData, null, 2));

    // You could also save critical errors to local storage for later analysis
    if (this.isCriticalError(error)) {
      this.saveCriticalError(logData);
    }
  }

  private isCriticalError(error: any): boolean {
    const criticalCodes = [
      'data-loss',
      'internal',
      'permission-denied',
      'unauthenticated',
    ];

    return criticalCodes.includes(error?.code);
  }

  private async saveCriticalError(logData: any): Promise<void> {
    try {
      // Save to AsyncStorage or Realm for later analysis
      // This is useful for debugging issues that users report
      console.log('Critical error saved for analysis:', logData);
    } catch (saveError) {
      console.error('Failed to save critical error:', saveError);
    }
  }

  // Retry logic for recoverable errors
  async withRetry<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    maxRetries: number = 3,
    delay: number = 1000,
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on certain errors
        if (!this.isRetryableError(error)) {
          throw this.handleError(error, context);
        }

        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
        console.log(
          `Retrying ${context.operation}, attempt ${attempt + 1}/${maxRetries}`,
        );
      }
    }

    throw this.handleError(lastError, context);
  }

  private isRetryableError(error: any): boolean {
    const retryableCodes = [
      'unavailable',
      'deadline-exceeded',
      'resource-exhausted',
      'aborted',
      'network-request-failed',
      'timeout',
    ];

    return retryableCodes.includes(error?.code);
  }
}

export const errorInterceptor = new ErrorInterceptor();
