/**
 * Centralized API Client for AIVO Platform
 * Provides type-safe, error-handled, retry-enabled API communication
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

export interface APIClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onUnauthorized?: () => void;
  getAuthToken?: () => string | null;
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

class APIClient {
  private client: AxiosInstance;
  private config: APIClientConfig;

  constructor(config: APIClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8001',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupRetry();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.config.getAuthToken?.();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.formatError(error));
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.config.onUnauthorized?.();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private setupRetry(): void {
    axiosRetry(this.client, {
      retries: this.config.retries,
      retryDelay: (retryCount) => {
        return retryCount * (this.config.retryDelay || 1000);
      },
      retryCondition: (error) => {
        // Retry on network errors or 5xx errors
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response?.status || 0) >= 500;
      },
    });
  }

  private formatError(error: AxiosError): APIError {
    if (error.response) {
      // Server responded with error
      return {
        message: (error.response.data as any)?.message || error.message,
        code: (error.response.data as any)?.code,
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Error setting up request
      return {
        message: error.message,
        code: 'REQUEST_ERROR',
      };
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Upload file
   */
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  /**
   * Get raw axios instance for advanced use cases
   */
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// Create default instance
export const apiClient = new APIClient();

// Export class for custom instances
export { APIClient };
