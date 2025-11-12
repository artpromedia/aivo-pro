/**
 * @aivo/api - Centralized API Client Package
 * Production-ready API communication layer
 */

// Export client
export { apiClient, APIClient } from './client';
export type { APIClientConfig, APIError } from './client';

// Export endpoints
export { API_ENDPOINTS } from './endpoints';
export type { APIEndpoint } from './endpoints';

// Export hooks
export {
  useAPIGet,
  useAPIPost,
  useAPIPut,
  useAPIDelete,
  useAPIUpload,
} from './hooks';
export type { UseAPIOptions, UseAPIReturn } from './hooks';
