/**
 * React hooks for API calls
 */
import { useState, useCallback } from 'react';
import { apiClient, APIError } from './client';

export interface UseAPIOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: APIError) => void;
  initialLoading?: boolean;
}

export interface UseAPIReturn<T, P = any> {
  data: T | null;
  loading: boolean;
  error: APIError | null;
  execute: (params?: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook for GET requests
 */
export function useAPIGet<T = any>(
  url: string,
  options: UseAPIOptions<T> = {}
): UseAPIReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.initialLoading || false);
  const [error, setError] = useState<APIError | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.get<T>(url);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      options.onError?.(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for POST requests
 */
export function useAPIPost<T = any, P = any>(
  url: string,
  options: UseAPIOptions<T> = {}
): UseAPIReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const execute = useCallback(async (params?: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.post<T>(url, params);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      options.onError?.(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for PUT requests
 */
export function useAPIPut<T = any, P = any>(
  url: string,
  options: UseAPIOptions<T> = {}
): UseAPIReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const execute = useCallback(async (params?: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.put<T>(url, params);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      options.onError?.(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for DELETE requests
 */
export function useAPIDelete<T = any>(
  url: string,
  options: UseAPIOptions<T> = {}
): UseAPIReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.delete<T>(url);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      options.onError?.(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for file upload
 */
export function useAPIUpload<T = any>(
  url: string,
  options: UseAPIOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const [progress, setProgress] = useState(0);

  const execute = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      const result = await apiClient.upload<T>(url, file, setProgress);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      options.onError?.(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setProgress(0);
  }, []);

  return { data, loading, error, progress, execute, reset };
}
