import axios, { AxiosInstance } from 'axios';
import { User, LoginRequest, SignupRequest, AuthTokens, MFASetupResponse, AuthResponse, PasswordResetRequest, PasswordResetConfirm, UserRole } from '../types/auth.types';
import { tokenService } from './tokenService';
import { seedDemoUsers, DEMO_USERS } from './demoUsers';

class AuthService {
  private api: AxiosInstance;
  private refreshPromise: Promise<AuthTokens> | null = null;
  private localStorageUsers = 'aivo_users';
  private isLocalMode = true; // Default to local mode

  constructor(baseURL: string = 'http://localhost:8001') {
    // Check if we should use backend auth (must explicitly set env var to true)
    const useBackendAuth = typeof window !== 'undefined' 
      ? (window as any).VITE_USE_BACKEND_AUTH === 'true'
      : false;
    
    this.isLocalMode = !useBackendAuth;
    
    console.log('🔐 AuthService initialized:', {
      isLocalMode: this.isLocalMode,
      useBackendAuth,
      willSeedDemoUsers: this.isLocalMode && typeof window !== 'undefined'
    });
    
    // Seed demo users on initialization in local mode
    if (this.isLocalMode && typeof window !== 'undefined') {
      seedDemoUsers();
    }
    
    this.api = axios.create({
      baseURL: `${baseURL}/v1/auth`,
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

  // Local storage helpers for simplified auth
  private getLocalUsers(): any[] {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(this.localStorageUsers);
    return users ? JSON.parse(users) : [];
  }

  private saveLocalUser(user: any): void {
    if (typeof window === 'undefined') return;
    const users = this.getLocalUsers();
    users.push(user);
    localStorage.setItem(this.localStorageUsers, JSON.stringify(users));
  }

  private findLocalUser(email: string): any {
    return this.getLocalUsers().find((u: any) => u.email === email);
  }

  private generateMockToken(userId: string, role: UserRole): string {
    return btoa(JSON.stringify({ userId, role, exp: Date.now() + 3600000 }));
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    console.log('AuthService.signup called with:', data);
    
    // Local mode - simplified signup
    if (this.isLocalMode) {
      const existingUser = this.findLocalUser(data.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      const userId = `user_${Date.now()}`;
      const user: User = {
        id: userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || UserRole.PARENT,
        emailVerified: true, // Auto-verify in local mode
        mfaEnabled: false,
        createdAt: new Date().toISOString(),
      };

      this.saveLocalUser({ ...user, password: data.password });

      const tokens: AuthTokens = {
        accessToken: this.generateMockToken(userId, user.role),
        refreshToken: this.generateMockToken(userId, user.role),
        expiresIn: 3600,
        tokenType: 'Bearer',
      };

      tokenService.setTokens(tokens);
      
      return { user, tokens };
    }
    
    // Backend mode (original implementation)
    const transformedData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
    };

    console.log('Sending transformed data to backend:', transformedData);
    console.log('API URL:', this.api.defaults.baseURL);

    const response = await this.api.post('/signup', transformedData);
    console.log('Backend response:', response.data);
    
    if (response.data.verification_required) {
      return {
        user: {
          id: response.data.user_id,
          email: response.data.email,
          firstName: '',
          lastName: '',
          role: UserRole.PARENT,
          organizationId: undefined,
          districtId: undefined,
          createdAt: new Date().toISOString(),
          emailVerified: false,
          mfaEnabled: false,
        },
        tokens: {
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
          tokenType: 'Bearer' as const,
        },
      };
    }
    
    if (response.data.tokens || (response.data.access_token && response.data.refresh_token)) {
      const tokens = response.data.tokens || {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: 'Bearer' as const,
      };
      
      tokenService.setTokens(tokens);
      
      return {
        user: response.data.user,
        tokens,
      };
    }
    
    return {
      user: {} as User,
      tokens: {} as AuthTokens,
      user_id: response.data.user_id,
      email: response.data.email,
      verification_required: response.data.verification_required,
      message: response.data.message,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    await this.api.post('/verify-email', { token });
  }

  async resendVerification(email: string): Promise<void> {
    await this.api.post('/resend-verification', { email });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 AuthService.login called');
    console.log('  - isLocalMode:', this.isLocalMode);
    console.log('  - credentials:', { email: credentials.email, hasPassword: !!credentials.password });
    
    // Local mode - simplified login
    if (this.isLocalMode) {
      console.log('  ✅ Using LOCAL MODE authentication');
      const user = this.findLocalUser(credentials.email!);
      
      if (!user) {
        console.log('  ❌ User not found in local storage');
        throw new Error('Invalid credentials - user not found');
      }

      if (user.password !== credentials.password) {
        console.log('  ❌ Password mismatch');
        throw new Error('Invalid credentials - wrong password');
      }

      console.log('  ✅ Login successful for:', user.email);
      
      const tokens: AuthTokens = {
        accessToken: this.generateMockToken(user.id, user.role),
        refreshToken: this.generateMockToken(user.id, user.role),
        expiresIn: 3600,
        tokenType: 'Bearer',
      };

      tokenService.setTokens(tokens);
      
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, tokens };
    }
    
    // Backend mode (original implementation)
    console.log('  ⚠️  Using BACKEND MODE authentication');
    console.log('  - API URL:', this.api.defaults.baseURL);
    const response = await this.api.post('/login', credentials);
    console.log('Login response:', response.data);
    
    if (response.data.access_token && response.data.refresh_token) {
      const tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: 'Bearer' as const,
      };
      
      console.log('Setting tokens:', tokens);
      tokenService.setTokens(tokens);
      
      return {
        user: response.data.user,
        tokens,
      };
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
    // Local mode - decode token
    if (this.isLocalMode) {
      const token = tokenService.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      try {
        const decoded = JSON.parse(atob(token));
        const user = this.getLocalUsers().find((u: any) => u.id === decoded.userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      } catch (error) {
        throw new Error('Invalid token');
      }
    }

    // Backend mode
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
    if (!token) return false;
    
    // In local mode, tokens don't expire
    if (this.isLocalMode) {
      return true;
    }
    
    // In backend mode, check expiration
    return !tokenService.isTokenExpired();
  }

  getAccessToken(): string | null {
    return tokenService.getAccessToken();
  }

  getRefreshToken(): string | null {
    return tokenService.getRefreshToken();
  }
}

export const authService = new AuthService();
