/**
 * File Upload Hooks
 */

import { useState, useEffect } from 'react';
import { FileUploadManager, type UploadFile, type UploadOptions } from './manager';

export function useFileUpload(options?: UploadOptions) {
  const [manager] = useState(() => new FileUploadManager(options));
  const [files, setFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    const unsubscribe = manager.subscribe(setFiles);
    return unsubscribe;
  }, [manager]);

  return {
    files,
    addFiles: (files: File[]) => manager.addFiles(files),
    uploadFile: (id: string) => manager.uploadFile(id),
    removeFile: (id: string) => manager.removeFile(id),
    retryFile: (id: string) => manager.retryFile(id),
    clearAll: () => manager.clearAll(),
    clearCompleted: () => manager.clearCompleted(),
    getFile: (id: string) => manager.getFile(id),
    getFilesByStatus: (status: UploadFile['status']) => manager.getFilesByStatus(status),
  };
}

export function useDropzone(
  onDrop: (files: File[]) => void,
  options?: { accept?: string[]; multiple?: boolean }
) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    
    if (!options?.multiple && files.length > 1) {
      onDrop([files[0]]);
      return;
    }

    onDrop(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onDrop(files);
    }
  };

  return {
    isDragging,
    getRootProps: () => ({
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    }),
    getInputProps: () => ({
      type: 'file' as const,
      onChange: handleFileInput,
      accept: options?.accept?.join(','),
      multiple: options?.multiple,
      style: { display: 'none' },
    }),
  };
}
