/**
 * Biometric Authentication Component
 */

import React, { useState } from 'react';
import { useBiometric } from '../advanced-hooks';
import { Fingerprint, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export interface BiometricAuthProps {
  /** Called when biometric registration succeeds */
  onRegisterSuccess?: (credential: Credential) => void;
  /** Called when biometric verification succeeds */
  onVerifySuccess?: (credential: Credential) => void;
  /** Called on error */
  onError?: (error: Error) => void;
  /** Mode: register or verify */
  mode: 'register' | 'verify';
  /** Registration options */
  registerOptions?: {
    rpId: string;
    rpName: string;
    userId: string;
    userName: string;
    userDisplayName: string;
  };
  /** Verification options */
  verifyOptions?: {
    rpId: string;
    credentialId: string;
  };
}

export function BiometricAuth({
  onRegisterSuccess,
  onVerifySuccess,
  onError,
  mode,
  registerOptions,
  verifyOptions,
}: BiometricAuthProps) {
  const { isAvailable, isLoading, error, register, verify } = useBiometric();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleRegister = async () => {
    if (!registerOptions) return;

    try {
      setStatus('processing');
      const encoder = new TextEncoder();
      
      const credential = await register({
        challenge: window.crypto.getRandomValues(new Uint8Array(32)).buffer,
        rpId: registerOptions.rpId,
        rpName: registerOptions.rpName,
        userId: encoder.encode(registerOptions.userId).buffer,
        userName: registerOptions.userName,
        userDisplayName: registerOptions.userDisplayName,
      });

      if (credential) {
        setStatus('success');
        onRegisterSuccess?.(credential);
      }
    } catch (err) {
      setStatus('error');
      onError?.(err as Error);
    }
  };

  const handleVerify = async () => {
    if (!verifyOptions) return;

    try {
      setStatus('processing');
      
      const credential = await verify({
        challenge: window.crypto.getRandomValues(new Uint8Array(32)).buffer,
        rpId: verifyOptions.rpId,
        credentialId: verifyOptions.credentialId,
      });

      if (credential) {
        setStatus('success');
        onVerifySuccess?.(credential);
      }
    } catch (err) {
      setStatus('error');
      onError?.(err as Error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="font-semibold text-yellow-900">Biometric Auth Unavailable</h3>
            <p className="text-sm text-yellow-700">
              Your device doesn't support biometric authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            {status === 'processing' ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : status === 'error' ? (
              <AlertCircle className="w-8 h-8 text-white" />
            ) : (
              <Fingerprint className="w-8 h-8 text-white" />
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {mode === 'register' ? 'Setup Biometric Auth' : 'Biometric Sign In'}
            </h3>
            <p className="text-gray-600">
              {mode === 'register'
                ? 'Use your fingerprint, face, or device PIN to secure your account'
                : 'Verify your identity using biometric authentication'}
            </p>
          </div>

          {status === 'success' ? (
            <div className="text-green-600 font-medium">
              ✓ {mode === 'register' ? 'Registration' : 'Verification'} successful!
            </div>
          ) : status === 'error' ? (
            <div className="text-red-600 font-medium">
              {error?.message || 'Authentication failed'}
            </div>
          ) : (
            <button
              onClick={mode === 'register' ? handleRegister : handleVerify}
              disabled={status === 'processing'}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
            >
              {status === 'processing'
                ? 'Processing...'
                : mode === 'register'
                  ? 'Register Biometric'
                  : 'Authenticate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
