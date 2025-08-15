export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
  uploadUrl?: string;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
}

export interface PhotoFile {
  id: string;
  name: string;
  uri: string;
  type:
    | 'frontal'
    | 'posterior'
    | 'lateral_izquierda'
    | 'lateral_derecha'
    | 'interior';
  uploadUrl?: string;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
}

export interface DocumentsData {
  nationalIdFront: DocumentFile | null;
  nationalIdBack: DocumentFile | null;
  driverLicense: DocumentFile | null;
  vehicleRegistration: DocumentFile | null;
}

export interface PhotosData {
  front: PhotoFile | null;
  back: PhotoFile | null;
  leftSide: PhotoFile | null;
  rightSide: PhotoFile | null;
  interior: PhotoFile | null;
}