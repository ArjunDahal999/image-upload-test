'use client';

import { FilePreviewProps } from '@/types/image';
import { formatFileSize } from '../utils/fileValidation';

export default function FilePreview({ files, onRemoveFile, errors }: FilePreviewProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Selected Files ({files.length})
      </h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file, index) => {
          const fileError = errors[`file-${index}`];
          const imageUrl = URL.createObjectURL(file);
          
          return (
            <div
              key={`${file.name}-${index}`}
              className={`
                relative border rounded-lg p-4 bg-white dark:bg-gray-800
                ${fileError 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-200 dark:border-gray-700'
                }
              `}
            >
              {/* Featured badge for first image */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Featured
                </div>
              )}
              
              {/* Remove button */}
              <button
                onClick={() => onRemoveFile(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
              
              {/* Image preview */}
              <div className="aspect-square mb-3 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Preview of ${file.name}`}
                  className="w-full h-full object-cover"
                  onLoad={() => URL.revokeObjectURL(imageUrl)}
                />
              </div>
              
              {/* File info */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                </p>
                
                {/* Error message */}
                {fileError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    {fileError}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* General error */}
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.general}
          </p>
        </div>
      )}
    </div>
  );
}