'use client';

import { useCallback, useState } from 'react';
import { FileDropZoneProps } from '@/types/image';

export default function FileDropZone({ 
  onFilesSelected, 
  accept, 
  maxFiles, 
  disabled 
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles));
    }
  }, [disabled, maxFiles, onFilesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles));
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  }, [maxFiles, onFilesSelected]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      document.getElementById('file-input')?.click();
    }
  }, [disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleClick();
    }
  }, [disabled, handleClick]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragOver 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label="Upload images by clicking or dragging files here"
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="space-y-4">
        <div className="mx-auto w-12 h-12 text-gray-400">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {isDragOver ? 'Drop files here' : 'Upload images'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            JPEG, PNG, WebP up to 5MB each (max {maxFiles} files)
          </p>
        </div>
      </div>
    </div>
  );
}