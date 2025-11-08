/**
 * File Upload Components
 */

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, RefreshCw, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import { useFileUpload, useDropzone } from './hooks';
import type { UploadFile, UploadOptions } from './manager';

export interface FileUploaderProps {
  options?: UploadOptions;
  onFilesAdded?: (files: UploadFile[]) => void;
  className?: string;
}

export function FileUploader({ options, onFilesAdded, className = '' }: FileUploaderProps) {
  const { files, addFiles, removeFile, retryFile, clearCompleted } = useFileUpload(options);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (droppedFiles: File[]) => {
    const ids = await addFiles(droppedFiles);
    if (onFilesAdded) {
      const uploadFiles = ids.map(id => files.find(f => f.id === id)).filter(Boolean) as UploadFile[];
      onFilesAdded(uploadFiles);
    }
  };

  const { isDragging, getRootProps, getInputProps } = useDropzone(handleDrop, {
    accept: options?.acceptedTypes,
    multiple: options?.multiple,
  });

  return (
    <div className={className}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragging ? 'border-coral bg-coral/5' : 'border-gray-300 hover:border-coral'}
        `}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} {...getInputProps()} />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        
        <p className="text-lg font-medium mb-2">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        
        <p className="text-sm text-gray-500 mb-4">or click to browse</p>
        
        {options?.acceptedTypes && options.acceptedTypes.length > 0 && (
          <p className="text-xs text-gray-400">
            Accepted: {options.acceptedTypes.join(', ')}
          </p>
        )}
        
        {options?.maxSize && (
          <p className="text-xs text-gray-400">
            Max size: {(options.maxSize / 1024 / 1024).toFixed(0)}MB
          </p>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Files ({files.length})</h4>
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear completed
            </button>
          </div>

          {files.map(file => (
            <FileItem
              key={file.id}
              file={file}
              onRemove={() => removeFile(file.id)}
              onRetry={() => retryFile(file.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface FileItemProps {
  file: UploadFile;
  onRemove: () => void;
  onRetry: () => void;
}

export function FileItem({ file, onRemove, onRetry }: FileItemProps) {
  const statusIcons = {
    pending: <Upload className="w-5 h-5 text-gray-400" />,
    uploading: <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  const statusColors = {
    pending: 'border-gray-200',
    uploading: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
  };

  return (
    <div className={`border rounded-lg p-4 ${statusColors[file.status]}`}>
      <div className="flex items-center gap-3">
        {/* Preview or Icon */}
        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {file.preview ? (
            <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
          ) : file.type.startsWith('image/') ? (
            <ImageIcon className="w-6 h-6 text-gray-400" />
          ) : (
            <FileIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{file.name}</p>
          <p className="text-sm text-gray-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>
          
          {file.error && (
            <p className="text-sm text-red-600 mt-1">{file.error}</p>
          )}
          
          {file.status === 'uploading' && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{file.progress}%</p>
            </div>
          )}
        </div>

        {/* Status Icon */}
        <div className="flex-shrink-0">{statusIcons[file.status]}</div>

        {/* Actions */}
        <div className="flex-shrink-0 flex gap-2">
          {file.status === 'error' && (
            <button
              onClick={onRetry}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Retry upload"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export interface FilePreviewProps {
  file: UploadFile;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FilePreview({ file, size = 'md', className = '' }: FilePreviewProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-gray-100 ${className}`}>
      {file.preview ? (
        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {file.type.startsWith('image/') ? (
            <ImageIcon className="w-1/2 h-1/2 text-gray-400" />
          ) : (
            <FileIcon className="w-1/2 h-1/2 text-gray-400" />
          )}
        </div>
      )}
    </div>
  );
}
