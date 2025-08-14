import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import DocumentPicker, { DocumentPickerResponse } from '@react-native-documents/picker';

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

  const handleResponse = (response: ImagePickerResponse): string | null => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return null;
    }
    if (response.errorCode) {
      console.error('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen.');
      return null;
    }
    if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
      return response.assets[0].uri;
    }
    return null;
  };

  /**
   * Abre la cámara para tomar una foto.
   * @returns La URI de la imagen tomada o null si se cancela.
   */
  const pickImageFromCamera = async (): Promise<string | null> => {
    const response = await launchCamera(cameraOptions);
    return handleResponse(response);
  };

  /**
   * Abre la galería para seleccionar una imagen.
   * @returns La URI de la imagen seleccionada o null si se cancela.
   */
  const pickImageFromGallery = async (): Promise<string | null> => {
    const response = await launchImageLibrary(libraryOptions);
    return handleResponse(response);
  };

  /**
   * Abre el selector de documentos para elegir un archivo (imagen o PDF).
   * @returns La URI del documento seleccionado o null si se cancela.
   */
  const pickDocument = async (): Promise<string | null> => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false, // Asegura que solo se pueda seleccionar un archivo
      });
      // La respuesta es un array, incluso si es un solo archivo
      if (result && result.length > 0) {
        return result[0].uri;
      }
      return null;
    } catch (err: any) {
      // El manejo de errores de cancelación se hace a través del código de error
      if (err.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled document picker');
      } else {
        console.error('DocumentPicker Error: ', err);
        Alert.alert('Error', 'Ocurrió un error al seleccionar el documento.');
      }
      return null;
    }
  };

  return {
    pickImageFromCamera,
    pickImageFromGallery,
    pickDocument,
  };
};
