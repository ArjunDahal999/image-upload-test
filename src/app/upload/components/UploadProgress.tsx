'use client';

import { UploadProgressProps } from '@/types/image';

export default function UploadProgress({ 
  progress, 
  uploading, 
  uploadedImages 
}: UploadProgressProps) {
  const progressEntries = Object.entries(progress);
  
  if (!uploading && progressEntries.length === 0 && uploadedImages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Upload Progress */}
      {(uploading || progressEntries.length > 0) && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {uploading ? 'Uploading...' : 'Upload Complete'}
          </h3>
          
          {progressEntries.map(([fileKey, progressValue]) => {
            const fileIndex = parseInt(fileKey.split('-')[1]);
            const isComplete = progressValue === 100;
            
            return (
              <div key={fileKey} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    File {fileIndex + 1}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {Math.round(progressValue)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isComplete 
                        ? 'bg-green-500' 
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Success Message and Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Successfully uploaded {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''}!
                </p>
              </div>
            </div>
          </div>
          
          {/* Uploaded Images Preview */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
              Uploaded Images
            </h4>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedImages.map((image, index) => (
                <div
                  key={image.filename}
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800"
                >
                  {/* Featured badge */}
                  {image.isFeatured && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                  
                  {/* Image preview */}
                  <div className="aspect-square mb-3 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                    <img
                      src={image.url}
                      alt={`Uploaded image ${image.filename}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Image info */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 hover:underline"
                      >
                        View full size
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}