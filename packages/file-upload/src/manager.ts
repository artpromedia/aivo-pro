/**
 * File Upload Manager
 */

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  preview?: string;
  url?: string;
}

export interface UploadOptions {
  maxSize?: number; // bytes
  maxFiles?: number;
  acceptedTypes?: string[];
  autoUpload?: boolean;
  multiple?: boolean;
  onUpload?: (file: UploadFile) => Promise<{ url: string }>;
  onProgress?: (file: UploadFile, progress: number) => void;
  onSuccess?: (file: UploadFile, url: string) => void;
  onError?: (file: UploadFile, error: string) => void;
}

type UploadListener = (files: UploadFile[]) => void;

export class FileUploadManager {
  private files: Map<string, UploadFile> = new Map();
  private listeners: Set<UploadListener> = new Set();
  private nextId = 1;
  private options: UploadOptions;

  constructor(options: UploadOptions = {}) {
    this.options = {
      maxSize: 10 * 1024 * 1024, // 10MB default
      maxFiles: 10,
      acceptedTypes: [],
      autoUpload: true,
      multiple: true,
      ...options,
    };
  }

  subscribe(listener: UploadListener): () => void {
    this.listeners.add(listener);
    listener(Array.from(this.files.values()));

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const files = Array.from(this.files.values());
    this.listeners.forEach(listener => listener(files));
  }

  private validateFile(file: File): string | null {
    if (this.options.maxSize && file.size > this.options.maxSize) {
      return `File size exceeds ${(this.options.maxSize / 1024 / 1024).toFixed(1)}MB`;
    }

    if (this.options.acceptedTypes && this.options.acceptedTypes.length > 0) {
      const isAccepted = this.options.acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -2));
        }
        return file.type === type || file.name.endsWith(type);
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed: ${this.options.acceptedTypes.join(', ')}`;
      }
    }

    return null;
  }

  private async generatePreview(file: File): Promise<string | undefined> {
    if (!file.type.startsWith('image/')) {
      return undefined;
    }

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }

  async addFiles(files: File[]): Promise<string[]> {
    const ids: string[] = [];

    for (const file of files) {
      if (this.options.maxFiles && this.files.size >= this.options.maxFiles) {
        console.warn(`Maximum file limit reached (${this.options.maxFiles})`);
        break;
      }

      const error = this.validateFile(file);
      const id = `file-${this.nextId++}`;
      const preview = await this.generatePreview(file);

      const uploadFile: UploadFile = {
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined,
        preview,
      };

      this.files.set(id, uploadFile);
      ids.push(id);

      if (!error && this.options.autoUpload) {
        this.uploadFile(id);
      }
    }

    this.notify();
    return ids;
  }

  async uploadFile(id: string): Promise<void> {
    const file = this.files.get(id);
    if (!file || file.status === 'uploading' || file.status === 'success') {
      return;
    }

    file.status = 'uploading';
    file.progress = 0;
    this.notify();

    try {
      if (!this.options.onUpload) {
        throw new Error('No upload handler configured');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        if (file.progress < 90) {
          file.progress += 10;
          this.options.onProgress?.(file, file.progress);
          this.notify();
        }
      }, 200);

      const result = await this.options.onUpload(file);

      clearInterval(progressInterval);

      file.status = 'success';
      file.progress = 100;
      file.url = result.url;
      this.options.onSuccess?.(file, result.url);
      this.notify();
    } catch (error) {
      file.status = 'error';
      file.error = error instanceof Error ? error.message : 'Upload failed';
      this.options.onError?.(file, file.error);
      this.notify();
    }
  }

  removeFile(id: string): void {
    this.files.delete(id);
    this.notify();
  }

  retryFile(id: string): void {
    const file = this.files.get(id);
    if (file && file.status === 'error') {
      file.status = 'pending';
      file.error = undefined;
      this.uploadFile(id);
    }
  }

  clearAll(): void {
    this.files.clear();
    this.notify();
  }

  clearCompleted(): void {
    for (const [id, file] of this.files.entries()) {
      if (file.status === 'success') {
        this.files.delete(id);
      }
    }
    this.notify();
  }

  getFiles(): UploadFile[] {
    return Array.from(this.files.values());
  }

  getFile(id: string): UploadFile | undefined {
    return this.files.get(id);
  }

  getFilesByStatus(status: UploadFile['status']): UploadFile[] {
    return Array.from(this.files.values()).filter(f => f.status === status);
  }
}
