/**
 * Helper types for onboarding process
 */

import { DocumentsData, PhotosData } from './documents';

/**
 * Extract just the upload URLs from DocumentsData
 * Used for tracking upload state in forms
 */
export type DocumentUploadUrls = {
  [K in keyof DocumentsData]: string | null;
};

/**
 * Extract just the upload URLs from PhotosData
 * Used for tracking upload state in forms
 */
export type PhotoUploadUrls = {
  [K in keyof PhotosData]: string | null;
};

/**
 * Check if all documents are uploaded
 */
export function areAllDocumentsUploaded(urls: DocumentUploadUrls): boolean {
  return Object.values(urls).every(url => url !== null && url !== '');
}

/**
 * Check if all photos are uploaded
 */
export function areAllPhotosUploaded(urls: PhotoUploadUrls): boolean {
  return Object.values(urls).every(url => url !== null && url !== '');
}

/**
 * Extract URLs from DocumentsData structure
 */
export function extractDocumentUrls(documents: DocumentsData | null): DocumentUploadUrls {
  if (!documents) {
    return {
      nationalIdFront: null,
      nationalIdBack: null,
      driverLicense: null,
      vehicleRegistration: null,
    };
  }

  return {
    nationalIdFront: documents.nationalIdFront?.uploadUrl || null,
    nationalIdBack: documents.nationalIdBack?.uploadUrl || null,
    driverLicense: documents.driverLicense?.uploadUrl || null,
    vehicleRegistration: documents.vehicleRegistration?.uploadUrl || null,
  };
}

/**
 * Extract URLs from PhotosData structure
 */
export function extractPhotoUrls(photos: PhotosData | null): PhotoUploadUrls {
  if (!photos) {
    return {
      front: null,
      back: null,
      leftSide: null,
      rightSide: null,
      interior: null,
    };
  }

  return {
    front: photos.front?.uploadUrl || null,
    back: photos.back?.uploadUrl || null,
    leftSide: photos.leftSide?.uploadUrl || null,
    rightSide: photos.rightSide?.uploadUrl || null,
    interior: photos.interior?.uploadUrl || null,
  };
}