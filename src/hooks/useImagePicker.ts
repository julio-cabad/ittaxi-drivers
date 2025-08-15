/**
 * Professional image picker hook with comprehensive error handling
 */
import { useState, useCallback } from 'react';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';
import { errorInterceptor } from '../interceptors/errorInterceptor';
import { strings } from '../constants/strings';

export interface ImagePickerOptions {
  mediaType?: MediaType;
  quality?: PhotoQuality;
  maxWidth?: number;
  maxHeight?: number;
  allowsEditing?: boolean;
  saveToPhotos?: boolean;
}

export interface ImagePickerResult {
  uri: string | null;
  error: string | null;
  cancelled: boolean;
}

export const useImagePicker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  const handleImagePickerResponse = useCallback(
    (response: ImagePickerResponse, operation: string): ImagePickerResult => {
      if (response.didCancel) {
        return {
          uri: null,
          error: null,
          cancelled: true,
        };
      }

      if (response.errorCode || response.errorMessage) {
        const pickerError = new Error(
          response.errorMessage || strings.imagePicker.errors.unknown,
        );
        pickerError.name = 'ImagePickerError';
        (pickerError as any).code =
          response.errorCode || 'image-picker/unknown';

        const errorResponse = errorInterceptor.handleError(pickerError, {
          operation,
          additionalInfo: {
            errorCode: response.errorCode,
            errorMessage: response.errorMessage,
          },
        });

        setError(errorResponse.message);
        return {
          uri: null,
          error: errorResponse.message,
          cancelled: false,
        };
      }

      if (
        response.assets &&
        response.assets.length > 0 &&
        response.assets[0].uri
      ) {
        return {
          uri: response.assets[0].uri,
          error: null,
          cancelled: false,
        };
      }

      // No image selected but no explicit error
      const noImageError = new Error(
        strings.imagePicker.errors.noImageSelected,
      );
      noImageError.name = 'ImagePickerError';
      (noImageError as any).code = 'image-picker/no-image-selected';

      const errorResponse = errorInterceptor.handleError(noImageError, {
        operation,
        additionalInfo: { response },
      });

      setError(errorResponse.message);
      return {
        uri: null,
        error: errorResponse.message,
        cancelled: false,
      };
    },
    [],
  );

  const pickImage = useCallback(
    async (
      source: 'camera' | 'gallery',
      options: ImagePickerOptions = {},
    ): Promise<string | null> => {
      setIsLoading(true);
      resetState();

      try {
        const defaultOptions = {
          mediaType: 'photo' as MediaType,
          quality: 0.8 as PhotoQuality,
          maxWidth: 1920,
          maxHeight: 1920,
          saveToPhotos: source === 'camera',
          ...options,
        };

        let response: ImagePickerResponse;

        if (source === 'camera') {
          const cameraOptions: CameraOptions = {
            ...defaultOptions,
            saveToPhotos: defaultOptions.saveToPhotos,
          };
          response = await launchCamera(cameraOptions);
        } else {
          const libraryOptions: ImageLibraryOptions = defaultOptions;
          response = await launchImageLibrary(libraryOptions);
        }

        const result = handleImagePickerResponse(
          response,
          `pickImage-${source}`,
        );

        if (result.error) {
          setError(result.error);
        }

        return result.uri;
      } catch (err: any) {
        const errorResponse = errorInterceptor.handleError(err, {
          operation: `pickImage-${source}`,
          additionalInfo: { source, options },
        });

        setError(errorResponse.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleImagePickerResponse, resetState],
  );

  const pickFromCamera = useCallback(
    (options?: ImagePickerOptions) => pickImage('camera', options),
    [pickImage],
  );

  const pickFromGallery = useCallback(
    (options?: ImagePickerOptions) => pickImage('gallery', options),
    [pickImage],
  );

  return {
    pickImage,
    pickFromCamera,
    pickFromGallery,
    isLoading,
    error,
    resetState,
  };
};
