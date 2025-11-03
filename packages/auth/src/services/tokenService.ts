import { AuthTokens } from '../types/auth.types';
import CryptoJS from 'crypto-js';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'aivo_access_token',
  REFRESH_TOKEN: 'aivo_refresh_token',
  TOKEN_EXPIRES: 'aivo_token_expires',
} as const;

const ENCRYPTION_KEY = 'aivo_secure_key_2024';

class TokenService {
  private encrypt(text: string): string {
    try {
      return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    } catch {
      return text; // Fallback to plain text if encryption fails
    }
  }

  private decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) || encryptedText;
    } catch {
      return encryptedText; // Fallback to return as-is if decryption fails
    }
  }

  setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;

    try {
      const expirationTime = Date.now() + tokens.expiresIn * 1000;
      
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, this.encrypt(tokens.accessToken));
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, this.encrypt(tokens.refreshToken));
      localStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRES, expirationTime.toString());
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const encryptedToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
      return encryptedToken ? this.decrypt(encryptedToken) : null;
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const encryptedToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
      return encryptedToken ? this.decrypt(encryptedToken) : null;
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  getTokenExpiration(): number | null {
    if (typeof window === 'undefined') return null;

    try {
      const expires = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRES);
      return expires ? parseInt(expires, 10) : null;
    } catch (error) {
      console.error('Failed to retrieve token expiration:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const expirationTime = this.getTokenExpiration();
    if (!expirationTime) return true;
    
    // Add 5-minute buffer for token refresh
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() > (expirationTime - bufferTime);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRES);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    return !!(accessToken && refreshToken && !this.isTokenExpired());
  }

  // Get time until token expires (in milliseconds)
  getTimeUntilExpiry(): number {
    const expirationTime = this.getTokenExpiration();
    if (!expirationTime) return 0;
    
    const timeLeft = expirationTime - Date.now();
    return Math.max(0, timeLeft);
  }

  // Check if token will expire soon (within 10 minutes)
  willExpireSoon(): boolean {
    const timeLeft = this.getTimeUntilExpiry();
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    return timeLeft > 0 && timeLeft <= tenMinutes;
  }
}

export const tokenService = new TokenService();
