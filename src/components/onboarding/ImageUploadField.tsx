/**
 * Reusable component for image upload with preview, progress, and error states
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useImageUpload } from '../../hooks/useImageUpload';
import { strings } from '../../constants/strings';

export interface ImageUploadFieldProps {
  label: string;
  value: string | null;
  onImageSelected: (imageUri: string) => void;
  onUploadStart?: () => void;
  onUploadComplete: (downloadUrl: string) => void;
  onUploadError?: (error: string) => void;
  storagePath: string;
  isRequired?: boolean;
  aspectRatio?: number;
  placeholder?: string;
  disabled?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onImageSelected,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  storagePath,
  isRequired = true,
  aspectRatio = 16 / 9,
  placeholder = 'Toca para agregar imagen',
  disabled = false,
}) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const {
    pickImage,
    isLoading: isPickerLoading,
    error: pickerError,
  } = useImagePicker();
  const {
    uploadImage,
    uploadProgress,
    isUploading,
    error: uploadError,
    resetUpload,
  } = useImageUpload();

  /**
   * Handles image selection and upload
   */
  const handleImagePick = useCallback(
    async (source: 'camera' | 'gallery') => {
      try {
        resetUpload();

        const imageUri = await pickImage(source);
        if (!imageUri) return;

        setSelectedImageUri(imageUri);
        onImageSelected(imageUri);

        // Notify upload start
        onUploadStart?.();

        // Start upload immediately
        const downloadUrl = await uploadImage(imageUri, storagePath);
        onUploadComplete(downloadUrl);
      } catch (error: any) {
        console.error('Error in image pick/upload:', error);
        const errorMessage = error.message || 'Error al procesar la imagen';
        onUploadError?.(errorMessage);
      }
    },
    [
      pickImage,
      uploadImage,
      storagePath,
      onImageSelected,
      onUploadStart,
      onUploadComplete,
      onUploadError,
      resetUpload,
    ],
  );

  /**
   * Shows image picker options
   */
  const showImagePicker = useCallback(() => {
    if (disabled) return;

    Alert.alert(
      strings.imageUpload.picker.title,
      `${strings.imageUpload.picker.message} ${label.toLowerCase()}`,
      [
        {
          text: strings.imageUpload.picker.camera,
          onPress: () => handleImagePick('camera'),
        },
        {
          text: strings.imageUpload.picker.gallery,
          onPress: () => handleImagePick('gallery'),
        },
        {
          text: strings.imageUpload.picker.cancel,
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  }, [disabled, handleImagePick, label]);

  /**
   * Gets the current error message
   */
  const getCurrentError = useCallback((): string | null => {
    return uploadError || pickerError;
  }, [uploadError, pickerError]);

  /**
   * Gets the image to display
   */
  const getDisplayImage = useCallback((): string | null => {
    return value || selectedImageUri;
  }, [value, selectedImageUri]);

  /**
   * Determines if component is in loading state
   */
  const isLoading = isPickerLoading || isUploading;

  /**
   * Gets the container style based on state
   */
  const getContainerStyle = useCallback(() => {
    const baseStyle = { ...styles.container };

    if (disabled) {
      return { ...baseStyle, ...styles.disabled };
    } else if (getCurrentError()) {
      return { ...baseStyle, ...styles.error };
    } else if (getDisplayImage()) {
      return { ...baseStyle, ...styles.completed };
    }

    return baseStyle;
  }, [disabled, getCurrentError, getDisplayImage]);

  const displayImage = getDisplayImage();
  const currentError = getCurrentError();

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {isRequired && <Text style={styles.required}> *</Text>}
      </Text>

      {/* Upload Area */}
      <TouchableOpacity
        style={getContainerStyle()}
        onPress={showImagePicker}
        disabled={disabled || isLoading}
        accessibilityLabel={`${label} - ${
          displayImage ? 'Imagen seleccionada' : placeholder
        }`}
        accessibilityRole="button"
      >
        {displayImage ? (
          /* Image Preview */
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: displayImage }}
              style={[styles.image, { aspectRatio }]}
              resizeMode="cover"
            />

            {/* Upload Progress Overlay */}
            {isUploading && (
              <View style={styles.progressOverlay}>
                <View style={styles.progressContainer}>
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text style={styles.progressText}>
                    {strings.imageUpload.progress.uploading} {uploadProgress}%
                  </Text>
                </View>
              </View>
            )}

            {/* Success Indicator */}
            {value && !isUploading && (
              <View style={styles.successIndicator}>
                <Text style={styles.successText}>✓</Text>
              </View>
            )}
          </View>
        ) : (
          /* Placeholder */
          <View style={[styles.placeholder, { aspectRatio }]}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>
                  {isPickerLoading
                    ? strings.imageUpload.progress.processing
                    : `${strings.imageUpload.progress.uploading} ${uploadProgress}%`}
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.placeholderIcon}>📷</Text>
                <Text style={styles.placeholderText}>{placeholder}</Text>
              </>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Error Message */}
      {currentError && <Text style={styles.errorText}>{currentError}</Text>}

      {/* Helper Text */}
      {!currentError && !displayImage && (
        <Text style={styles.helperText}>
          Formatos soportados: JPG, PNG. Tamaño máximo: 5MB
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  container: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  completed: {
    borderColor: '#10b981',
    borderStyle: 'solid',
  },
  error: {
    borderColor: '#ef4444',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#f9fafb',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 8,
    textAlign: 'center',
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  successIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10b981',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
