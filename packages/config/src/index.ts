export const API_CONFIG = {
  baseUrl: process.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
};

export const AUTH_CONFIG = {
  tokenKey: 'aivo_auth_token',
  sessionTimeout: parseInt(process.env.VITE_SESSION_TIMEOUT || '3600000'),
};

export const FEATURE_FLAGS = {
  enableMFA: process.env.VITE_ENABLE_MFA === 'true',
  enableFocusMonitor: process.env.VITE_ENABLE_FOCUS_MONITOR === 'true',
};