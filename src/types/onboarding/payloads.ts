import { PersonalData } from './personal';
import { VehicleData } from './vehicle';
import { DocumentsData, PhotosData } from './documents';

export interface UpdateStepPayload {
  userId: string;
  step: number;
  data: Partial<PersonalData | VehicleData | DocumentsData | PhotosData>;
}

export interface UploadDocumentPayload {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  path: string;
  userId: string;
  documentType: keyof DocumentsData;
}

export interface UploadPhotoPayload {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  path: string;
  userId: string;
  photoType: keyof PhotosData;
}