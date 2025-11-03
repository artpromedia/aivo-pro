import { useState } from 'react';
import { MFASetupResponse } from '../types/auth.types';
import { authService } from '../services/authService';
import { mfaService } from '../services/mfaService';

export interface MFAHookReturn {
  setupData: MFASetupResponse | null;
  loading: boolean;
  error: string | null;
  setupMFA: () => Promise<void>;
  verifySetup: (code: string) => Promise<boolean>;
  verifyLogin: (code: string, tempToken: string) => Promise<void>;
  clearSetupData: () => void;
  setupTOTP: () => Promise<{ qrCode: string; secret: string }>;
  verifyTOTP: (code: string) => Promise<void>;
  generateBackupCodes: () => Promise<string[]>;
  clearError: () => void;
}

export function useMFA(): MFAHookReturn {
  const [setupData, setSetupData] = useState<MFASetupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupMFA = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.setupMFA();
      setSetupData(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to setup MFA');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async (code: string): Promise<boolean> => {
    if (!setupData) {
      setError('No MFA setup data available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const isValid = mfaService.verifyTOTPCode(code, setupData.secret);
      
      if (isValid) {
        await authService.confirmMFASetup(code);
        return true;
      } else {
        setError('Invalid verification code');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify MFA setup');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyLogin = async (code: string, tempToken: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.verifyMFA(code, tempToken);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid MFA code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearSetupData = () => {
    setSetupData(null);
    setError(null);
  };

  const setupTOTP = async (): Promise<{ qrCode: string; secret: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.setupMFA();
      setSetupData(response);
      return {
        qrCode: response.qrCode,
        secret: response.secret
      };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to setup TOTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyTOTP = async (code: string): Promise<void> => {
    if (!setupData) {
      setError('No MFA setup data available');
      throw new Error('No MFA setup data available');
    }

    setLoading(true);
    setError(null);

    try {
      const isValid = mfaService.verifyTOTPCode(code, setupData.secret);
      
      if (isValid) {
        await authService.confirmMFASetup(code);
      } else {
        setError('Invalid verification code');
        throw new Error('Invalid verification code');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify TOTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateBackupCodes = async (): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      // Generate 10 backup codes
      const codes: string[] = [];
      for (let i = 0; i < 10; i++) {
        codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
      }
      return codes;
    } catch (err: any) {
      setError('Failed to generate backup codes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    setupData,
    loading,
    error,
    setupMFA,
    verifySetup,
    verifyLogin,
    clearSetupData,
    setupTOTP,
    verifyTOTP,
    generateBackupCodes,
    clearError,
  };
}