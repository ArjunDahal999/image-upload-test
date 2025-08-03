import { useState, useCallback } from "react";
import { UploadState, UploadedImage } from "@/types/image";
import { validateFiles } from "../utils/fileValidation";

export function useFileUpload() {
  const [state, setState] = useState<UploadState>({
    files: [],
    uploading: false,
    progress: {},
    errors: {},
    uploadedImages: [],
  });

  const setFiles = useCallback((files: File[]) => {
    const errors = validateFiles(files);
    setState((prev) => ({
      ...prev,
      files,
      errors,
      uploadedImages: [],
    }));
  }, []);

  const removeFile = useCallback((index: number) => {
    setState((prev) => {
      const newFiles = prev.files.filter((_, i) => i !== index);
      const errors = validateFiles(newFiles);
      return {
        ...prev,
        files: newFiles,
        errors,
      };
    });
  }, []);

  const uploadFiles = useCallback(async () => {
    if (state.files.length === 0) return;

    setState((prev) => ({
      ...prev,
      uploading: true,
      progress: {},
      errors: {},
    }));

    try {
      const formData = new FormData();
      state.files.forEach((file) => {
        formData.append("images", file);
      });

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setState((prev) => {
          const newProgress = { ...prev.progress };
          state.files.forEach((_, index) => {
            const currentProgress = newProgress[`file-${index}`] || 0;
            if (currentProgress < 90) {
              newProgress[`file-${index}`] = Math.min(
                90,
                currentProgress + Math.random() * 30
              );
            }
          });
          return { ...prev, progress: newProgress };
        });
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      // Complete progress for all files
      const finalProgress: Record<string, number> = {};
      state.files.forEach((_, index) => {
        finalProgress[`file-${index}`] = 100;
      });

      setState((prev) => ({
        ...prev,
        uploading: false,
        progress: finalProgress,
        uploadedImages: result.images,
        files: [], // Clear files after successful upload
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        uploading: false,
        errors: {
          general: error instanceof Error ? error.message : "Upload failed",
        },
      }));
    }
  }, [state.files]);

  const reset = useCallback(() => {
    setState({
      files: [],
      uploading: false,
      progress: {},
      errors: {},
      uploadedImages: [],
    });
  }, []);

  return {
    ...state,
    setFiles,
    removeFile,
    uploadFiles,
    reset,
  };
}
