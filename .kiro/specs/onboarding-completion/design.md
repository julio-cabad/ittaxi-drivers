# Design Document

## Overview

Este diseño implementa la funcionalidad completa para las tres pantallas finales del onboarding: DocumentsUploadScreen, VehiclePhotosScreen y ReviewAndSubmitScreen. Se enfoca en crear una experiencia de usuario consistente con el resto de la aplicación, implementando un sistema robusto de captura/selección de imágenes, subida a Firebase Storage y validación de datos.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ UI Components   │    │ Business Logic   │    │ Data Layer      │
│                 │    │                  │    │                 │
│ - ImagePicker   │◄──►│ - useImageUpload │◄──►│ - Firebase      │
│ - ImagePreview  │    │ - useOnboarding  │    │ - Realm         │
│ - UploadButton  │    │ - Validation     │    │ - AsyncStorage  │
│ - ProgressBar   │    │ - Error Handling │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Component Hierarchy

```
DocumentsUploadScreen
├── ScreenWrapper
├── LinearGradient
├── HeaderSection
├── FormCard
│   ├── DocumentUploadField (x4)
│   │   ├── ImagePreview
│   │   ├── UploadButton
│   │   └── ProgressIndicator
│   └── NavigationButtons
└── ImagePickerModal
```

## Components and Interfaces

### Core Components

#### 1. ImageUploadField Component

```typescript
interface ImageUploadFieldProps {
  label: string;
  value: string | null;
  onImageSelected: (imageUri: string) => void;
  onUploadComplete: (downloadUrl: string) => void;
  isRequired?: boolean;
  aspectRatio?: number;
  maxSize?: number;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onImageSelected,
  onUploadComplete,
  isRequired = true,
  aspectRatio = 16/9,
  maxSize = 2 * 1024 * 1024 // 2MB
}) => {
  // Implementation
};
```

#### 2. ImagePickerModal Component

```typescript
interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (imageUri: string) => void;
  title: string;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onImageSelected,
  title
}) => {
  // Implementation with camera and gallery options
};
```

#### 3. ReviewSection Component

```typescript
interface ReviewSectionProps {
  title: string;
  data: Record<string, any>;
  onEdit: () => void;
  renderCustomField?: (key: string, value: any) => React.ReactNode;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  data,
  onEdit,
  renderCustomField
}) => {
  // Implementation
};
```

### Custom Hooks

#### 1. useImageUpload Hook

```typescript
interface UseImageUploadReturn {
  uploadImage: (imageUri: string, path: string) => Promise<string>;
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
  resetUpload: () => void;
}

const useImageUpload = (): UseImageUploadReturn => {
  // Implementation with Firebase Storage integration
};
```

#### 2. useImagePicker Hook

```typescript
interface UseImagePickerReturn {
  pickImage: (source: 'camera' | 'gallery') => Promise<string | null>;
  requestPermissions: () => Promise<boolean>;
  compressImage: (imageUri: string, quality?: number) => Promise<string>;
}

const useImagePicker = (): UseImagePickerReturn => {
  // Implementation with react-native-image-picker
};
```

## Data Models

### Document Data Structure

```typescript
interface DocumentData {
  cedulaFrontal: string | null;
  cedulaPosterior: string | null;
  licenciaConducir: string | null;
  matriculaVehiculo: string | null;
  uploadedAt: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}
```

### Vehicle Photos Data Structure

```typescript
interface VehiclePhotosData {
  frontal: string | null;
  posterior: string | null;
  lateralIzquierda: string | null;
  lateralDerecha: string | null;
  interior: string | null;
  uploadedAt: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}
```

### Firebase Storage Structure

```
/drivers/{userId}/
├── documents/
│   ├── cedula-frontal-{timestamp}.jpg
│   ├── cedula-posterior-{timestamp}.jpg
│   ├── licencia-{timestamp}.jpg
│   └── matricula-{timestamp}.jpg
└── vehicle-photos/
    ├── frontal-{timestamp}.jpg
    ├── posterior-{timestamp}.jpg
    ├── lateral-izq-{timestamp}.jpg
    ├── lateral-der-{timestamp}.jpg
    └── interior-{timestamp}.jpg
```

## Error Handling

### Error Types and Handling Strategy

```typescript
enum UploadErrorType {
  NETWORK_ERROR = 'network_error',
  FILE_TOO_LARGE = 'file_too_large',
  INVALID_FORMAT = 'invalid_format',
  PERMISSION_DENIED = 'permission_denied',
  STORAGE_QUOTA_EXCEEDED = 'storage_quota_exceeded'
}

interface UploadError {
  type: UploadErrorType;
  message: string;
  retryable: boolean;
}
```

### Retry Logic

```typescript
const uploadWithRetry = async (
  imageUri: string, 
  path: string, 
  maxRetries: number = 3
): Promise<string> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadImage(imageUri, path);
    } catch (error) {
      if (attempt === maxRetries || !isRetryableError(error)) {
        throw error;
      }
      await delay(attempt * 1000); // Exponential backoff
    }
  }
};
```

## Testing Strategy

### Unit Tests

1. **Component Tests**
   - ImageUploadField rendering and interactions
   - ImagePickerModal functionality
   - ReviewSection data display

2. **Hook Tests**
   - useImageUpload upload logic and error handling
   - useImagePicker permission and selection logic
   - useOnboarding data persistence

3. **Utility Tests**
   - Image compression functionality
   - File validation logic
   - Error handling utilities

### Integration Tests

1. **Upload Flow Tests**
   - Complete document upload process
   - Vehicle photos capture and upload
   - Data persistence across app restarts

2. **Navigation Tests**
   - Screen transitions and data preservation
   - Back navigation behavior
   - Progress recovery after app restart

### E2E Tests

1. **Complete Onboarding Flow**
   - Full user journey from registration to submission
   - Error scenarios and recovery
   - Offline/online behavior

## Performance Considerations

### Image Optimization

```typescript
const optimizeImage = async (imageUri: string): Promise<string> => {
  return await ImageResizer.createResizedImage(
    imageUri,
    1024, // maxWidth
    1024, // maxHeight
    'JPEG',
    80, // quality
    0, // rotation
    undefined, // outputPath
    false, // keepMeta
    {
      mode: 'contain',
      onlyScaleDown: true,
    }
  );
};
```

### Lazy Loading and Caching

- Implement lazy loading for image previews
- Cache uploaded images locally for offline viewing
- Use React.memo for expensive components
- Implement virtual scrolling for review screen if needed

### Memory Management

- Dispose of image resources after upload
- Implement proper cleanup in useEffect hooks
- Use weak references for large objects
- Monitor memory usage during image processing

## Security Considerations

### File Validation

```typescript
const validateImageFile = (imageUri: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Validate file type, size, and basic security checks
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Implementation details...
  });
};
```

### Firebase Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /drivers/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

## UI/UX Design Specifications

### Visual Consistency

- Use existing `onboardingStyles` for consistent theming
- Maintain gradient backgrounds and card layouts
- Follow established color scheme and typography
- Implement consistent spacing and padding

### Interaction Design

- Provide immediate visual feedback for all interactions
- Use loading states and progress indicators
- Implement smooth transitions between states
- Show clear success/error states

### Accessibility

- Add proper accessibility labels for screen readers
- Ensure sufficient color contrast ratios
- Implement keyboard navigation support
- Provide alternative text for images

### Responsive Design

- Support different screen sizes and orientations
- Optimize touch targets for mobile devices
- Handle safe area insets properly
- Test on various device form factors