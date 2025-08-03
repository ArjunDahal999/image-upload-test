'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileDropZone from './components/FileDropZone';
import FilePreview from './components/FilePreview';
import UploadProgress from './components/UploadProgress';
import { useFileUpload } from './hooks/useFileUpload';
import { VALIDATION_RULES } from './utils/fileValidation';

export default function UploadPage() {
  const router = useRouter();
  const {
    files,
    uploading,
    progress,
    errors,
    uploadedImages,
    setFiles,
    removeFile,
    uploadFiles,
    reset
  } = useFileUpload();

  // For demo purposes, we'll skip authentication check
  // In production, you'd check the session here
  
  const acceptedTypes = VALIDATION_RULES.allowedTypes.join(',');
  const hasValidFiles = files.length > 0 && Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Upload Images
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload multiple images for your salon. The first image will be set as featured.
          </p>
        </div>

        {/* Upload Interface */}
        <div className="space-y-8">
          {/* File Drop Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <FileDropZone
              onFilesSelected={setFiles}
              accept={acceptedTypes}
              maxFiles={VALIDATION_RULES.maxFiles}
              disabled={uploading}
            />
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <FilePreview
                files={files}
                onRemoveFile={removeFile}
                errors={errors}
              />
            </div>
          )}

          {/* Upload Button */}
          {hasValidFiles && (
            <div className="flex justify-center">
              <button
                onClick={uploadFiles}
                disabled={uploading}
                className={`
                  px-8 py-3 rounded-lg font-medium text-white transition-colors
                  ${uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800'
                  }
                `}
              >
                {uploading ? 'Uploading...' : `Upload ${files.length} Image${files.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {/* Upload Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <UploadProgress
              progress={progress}
              uploading={uploading}
              uploadedImages={uploadedImages}
            />
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {errors.general}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {(uploadedImages.length > 0 || Object.keys(errors).length > 0) && (
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Upload More Images
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}