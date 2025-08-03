// Type definitions for image upload functionality

export interface UploadedImage {
  url: string;
  filename: string;
  isFeatured: boolean;
}

export interface FileValidationRules {
  allowedTypes: string[];
  maxSize: number;
  maxFiles: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface UploadState {
  files: File[];
  uploading: boolean;
  progress: Record<string, number>;
  errors: Record<string, string>;
  uploadedImages: UploadedImage[];
}

export interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  maxFiles: number;
  disabled: boolean;
}

export interface FilePreviewProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  errors: Record<string, string>;
}

export interface UploadProgressProps {
  progress: Record<string, number>;
  uploading: boolean;
  uploadedImages: UploadedImage[];
}
