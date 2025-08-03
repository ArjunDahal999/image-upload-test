import { FileValidationRules, ValidationResult } from "@/types/image";

// File validation constants
export const VALIDATION_RULES: FileValidationRules = {
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxSize: 5 * 1024 * 1024, // 5MB in bytes
  maxFiles: 10,
};

// Validate file type
export function validateFileType(file: File): boolean {
  return VALIDATION_RULES.allowedTypes.includes(file.type);
}

// Validate file size
export function validateFileSize(file: File): boolean {
  return file.size <= VALIDATION_RULES.maxSize;
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Comprehensive file validation
export function validateFile(file: File): ValidationResult {
  const errors: string[] = [];

  if (!validateFileType(file)) {
    errors.push(
      `Invalid file type. Only JPEG, PNG, and WebP files are allowed.`
    );
  }

  if (!validateFileSize(file)) {
    errors.push(
      `File size too large. Maximum size is ${formatFileSize(
        VALIDATION_RULES.maxSize
      )}.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate multiple files
export function validateFiles(files: File[]): Record<string, string> {
  const errors: Record<string, string> = {};

  if (files.length > VALIDATION_RULES.maxFiles) {
    errors.general = `Too many files. Maximum ${VALIDATION_RULES.maxFiles} files allowed.`;
    return errors;
  }

  files.forEach((file, index) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      errors[`file-${index}`] = validation.errors.join(" ");
    }
  });

  return errors;
}
