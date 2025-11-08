/**
 * React hooks for advanced authentication
 */

import { useState, useEffect, useCallback } from 'react';
import {
  biometricAuth,
  type BiometricAuthOptions,
  type BiometricVerifyOptions,
} from './biometric';
import { mfaManager, type MFASetup, type MFAVerifyOptions } from './mfa';
import { ssoManager, type SSOAuthResult, type SSOProvider } from './sso';

/**
 * Hook for biometric authentication
 */
export function useBiometric() {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      setIsLoading(true);
      const available = await biometricAuth.isAvailable();
      setIsAvailable(available);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = useCallback(async (options: BiometricAuthOptions) => {
    try {
      setError(null);
      setIsLoading(true);
      const credential = await biometricAuth.register(options);
      return credential;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verify = useCallback(async (options: BiometricVerifyOptions) => {
    try {
      setError(null);
      setIsLoading(true);
      const credential = await biometricAuth.verify(options);
      return credential;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAuthenticatorInfo = useCallback(async () => {
    try {
      setError(null);
      return await biometricAuth.getAuthenticatorInfo();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  return {
    isAvailable,
    isLoading,
    error,
    register,
    verify,
    getAuthenticatorInfo,
  };
}

/**
 * Hook for MFA management
 */
export function useMFA() {
  const [setup, setSetup] = useState<MFASetup | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(30);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Update remaining time counter
  useEffect(() => {
    if (!setup) return;

    const updateTimer = () => {
      setRemainingTime(mfaManager.getRemainingTime());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [setup]);

  const setupMFA = useCallback((issuer: string, accountName: string, secret?: string) => {
    const mfaSetup = mfaManager.setup(issuer, accountName, secret);
    setSetup(mfaSetup);
    return mfaSetup;
  }, []);

  const verify = useCallback(
    async (options: MFAVerifyOptions): Promise<boolean> => {
      setIsVerifying(true);
      try {
        const isValid = mfaManager.verify(options);
        return isValid;
      } finally {
        setIsVerifying(false);
      }
    },
    []
  );

  const generateToken = useCallback((secret: string): string => {
    return mfaManager.generateTOTP(secret);
  }, []);

  const verifyBackupCode = useCallback((code: string, validCodes: string[]): boolean => {
    return mfaManager.verifyBackupCode(code, validCodes);
  }, []);

  const reset = useCallback(() => {
    setSetup(null);
    setRemainingTime(30);
  }, []);

  return {
    setup,
    remainingTime,
    isVerifying,
    setupMFA,
    verify,
    generateToken,
    verifyBackupCode,
    reset,
  };
}

/**
 * Hook for SSO authentication
 */
export function useSSO() {
  const [providers, setProviders] = useState<SSOProvider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [authResult, setAuthResult] = useState<SSOAuthResult | null>(null);

  useEffect(() => {
    setProviders(ssoManager.getProviders());
  }, []);

  const authorize = useCallback(async (providerId: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await ssoManager.authorize(providerId);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const handleCallback = useCallback(async (callbackUrl: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await ssoManager.handleCallback(callbackUrl);
      setAuthResult(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(
    async (providerId: string, refreshToken: string) => {
      try {
        setError(null);
        setIsLoading(true);
        const result = await ssoManager.refreshToken(providerId, refreshToken);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (providerId: string, idToken?: string) => {
    try {
      setError(null);
      await ssoManager.logout(providerId, idToken);
      setAuthResult(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  return {
    providers,
    isLoading,
    error,
    authResult,
    authorize,
    handleCallback,
    refreshToken,
    logout,
  };
}

/**
 * Hook for session management with auto-refresh
 */
export function useSession(
  providerId: string | null,
  refreshTokenValue: string | null,
  expiresIn: number | null
) {
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { refreshToken } = useSSO();

  useEffect(() => {
    if (!expiresIn) return;

    const expiryTime = Date.now() + expiresIn * 1000;

    const checkExpiry = () => {
      const remaining = Math.max(0, expiryTime - Date.now());
      setTimeRemaining(Math.floor(remaining / 1000));
      setIsExpired(remaining <= 0);
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);

    return () => clearInterval(interval);
  }, [expiresIn]);

  // Auto-refresh 5 minutes before expiry
  useEffect(() => {
    if (!providerId || !refreshTokenValue || !expiresIn) return;

    const refreshTime = (expiresIn - 300) * 1000; // 5 minutes before expiry
    const timeout = setTimeout(async () => {
      try {
        await refreshToken(providerId, refreshTokenValue);
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, refreshTime);

    return () => clearTimeout(timeout);
  }, [providerId, refreshTokenValue, expiresIn, refreshToken]);

  return {
    isExpired,
    timeRemaining,
    minutesRemaining: Math.floor(timeRemaining / 60),
    secondsRemaining: timeRemaining % 60,
  };
}
