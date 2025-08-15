import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import DocumentPicker from '@react-native-documents/picker';
import { errorInterceptor } from '../interceptors/errorInterceptor';
import { strings } from '../constants/strings';

// Opciones para la cámara y la galería
const cameraOptions: CameraOptions = {
  mediaType: 'photo',
  quality: 0.8,
  saveToPhotos: true,
};

const libraryOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
};

/**
 * Hook personalizado para manejar la selección de imágenes y documentos.
 * Encapsula la lógica de react-native-image-picker y @react-native-documents/picker.
 */
export const useDocumentPicker = () => {
  const handleResponse = (
    response: ImagePickerResponse,
    operation: string,
  ): string | null => {
    if (response.didCancel) {
      // User cancellation is not an error, just return null silently
      return null;
    }

    if (response.errorCode) {
      const error = new Error(
        response.errorMessage || 'Error al seleccionar imagen',
      );
      error.name = 'ImagePickerError';
      (error as any).code = response.errorCode;

      errorInterceptor.handleError(error, {
        operation,
        additionalInfo: { errorCode: response.errorCode },
      });
      return null;
    }

    if (
      response.assets &&
      response.assets.length > 0 &&
      response.assets[0].uri
    ) {
      return response.assets[0].uri;
    }

    return null;
  };

  /**
   * Abre la cámara para tomar una foto.
   * @returns La URI de la imagen tomada o null si se cancela.
   */
  const pickImageFromCamera = async (): Promise<string | null> => {
    try {
      const response = await launchCamera(cameraOptions);
      return handleResponse(response, 'pickImageFromCamera');
    } catch (error) {
      errorInterceptor.handleError(error, {
        operation: 'pickImageFromCamera',
        additionalInfo: { cameraOptions },
      });
      return null;
    }
  };

  /**
   * Abre la galería para seleccionar una imagen.
   * @returns La URI de la imagen seleccionada o null si se cancela.
   */
  const pickImageFromGallery = async (): Promise<string | null> => {
    try {
      const response = await launchImageLibrary(libraryOptions);
      return handleResponse(response, 'pickImageFromGallery');
    } catch (error) {
      errorInterceptor.handleError(error, {
        operation: 'pickImageFromGallery',
        additionalInfo: { libraryOptions },
      });
      return null;
    }
  };

  /**
   * Abre el selector de documentos para elegir un archivo (imagen o PDF).
   * @returns La URI del documento seleccionado o null si se cancela.
   */
  const pickDocument = async (): Promise<string | null> => {
    try {
      const result = await DocumentPicker.pick({
        type: ['image/*', 'application/pdf'],
      });

      // pick devuelve un objeto directamente
      if (result && result.uri) {
        return result.uri;
      }

      // No file selected
      const noFileError = new Error(strings.documentPicker.errors.noFileSelected);
      noFileError.name = 'DocumentPickerError';
      (noFileError as any).code = 'document-picker/no-file-selected';

      errorInterceptor.handleError(noFileError, {
        operation: 'pickDocument',
        additionalInfo: { result },
      });

      return null;
    } catch (error: any) {
      // Handle user cancellation
      if (DocumentPicker.isCancel(error)) {
        const cancelError = new Error(strings.documentPicker.errors.cancelled);
        cancelError.name = 'DocumentPickerError';
        (cancelError as any).code = 'document-picker/cancelled';

        errorInterceptor.handleError(cancelError, {
          operation: 'pickDocument',
          additionalInfo: { cancelled: true },
        });

        return null;
      }

      // Handle other errors
      const documentError = new Error(
        error.message || strings.documentPicker.errors.unknown,
      );
      documentError.name = 'DocumentPickerError';
      (documentError as any).code = 'document-picker/unknown';

      errorInterceptor.handleError(documentError, {
        operation: 'pickDocument',
        additionalInfo: { originalError: error },
      });

      return null;
    }
  };

  return {
    pickImageFromCamera,
    pickImageFromGallery,
    pickDocument,
  };
};
