import axios, { AxiosInstance } from 'axios';
import { User, LoginRequest, SignupRequest, AuthTokens, MFASetupResponse, AuthResponse, PasswordResetRequest, PasswordResetConfirm } from '../types/auth.types';
import { tokenService } from './tokenService';

class AuthService {
  private api: AxiosInstance;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor(baseURL: string = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3001') {
    this.api = axios.create({
      baseURL: `${baseURL}/api/auth`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth
    this.api.interceptors.request.use(
      (config) => {
        const token = tokenService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            await this.logout();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await this.api.post('/signup', data);
    
    if (response.data.tokens) {
      tokenService.setTokens(response.data.tokens);
    }
    
    return response.data;
  }

  async verifyEmail(token: string): Promise<void> {
    await this.api.post('/verify-email', { token });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post('/login', credentials);
    
    if (!response.data.requiresMFA && response.data.tokens) {
      tokenService.setTokens(response.data.tokens);
    }
    
    return response.data;
  }

  async verifyMFA(code: string, tempToken: string): Promise<AuthResponse> {
    const response = await this.api.post('/mfa/verify', { code, tempToken });
    
    if (response.data.tokens) {
      tokenService.setTokens(response.data.tokens);
    }
    
    return response.data;
  }

  async setupMFA(): Promise<MFASetupResponse> {
    const response = await this.api.post('/mfa/setup');
    return response.data;
  }

  async confirmMFASetup(code: string): Promise<{ backupCodes: string[] }> {
    const response = await this.api.post('/mfa/confirm', { code });
    return response.data;
  }

  async disableMFA(password: string): Promise<void> {
    await this.api.post('/mfa/disable', { password });
  }

  async refreshAccessToken(): Promise<AuthTokens> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.api
      .post('/refresh', { refreshToken })
      .then((response) => {
        const tokens = response.data;
        tokenService.setTokens(tokens);
        return tokens;
      })
      .catch((error) => {
        tokenService.clearTokens();
        throw error;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  async logout(): Promise<void> {
    const refreshToken = tokenService.getRefreshToken();
    
    try {
      if (refreshToken) {
        await this.api.post('/logout', { refreshToken });
      }
    } catch (error) {
      // Log error but don't throw - we still want to clear tokens
      console.warn('Logout API call failed:', error);
    } finally {
      tokenService.clearTokens();
    }
  }

  async resetPasswordRequest(email: string): Promise<void> {
    await this.api.post('/reset-password', { email });
  }

  async resetPasswordConfirm(token: string, newPassword: string): Promise<void> {
    await this.api.post('/reset-password/confirm', { token, newPassword });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.post('/change-password', { currentPassword, newPassword });
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/me');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.api.patch('/me', data);
    return response.data;
  }

  async deleteAccount(password: string): Promise<void> {
    await this.api.delete('/me', { data: { password } });
    tokenService.clearTokens();
  }

  // Utility methods
  isAuthenticated(): boolean {
    const token = tokenService.getAccessToken();
    return !!token && !tokenService.isTokenExpired();
  }

  getAccessToken(): string | null {
    return tokenService.getAccessToken();
  }

  getRefreshToken(): string | null {
    return tokenService.getRefreshToken();
  }
}

export const authService = new AuthService();
