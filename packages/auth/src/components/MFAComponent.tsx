/**
 * MFA Setup and Verification Component
 */

import React, { useState, useEffect } from 'react';
import { useMFA } from '../advanced-hooks';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Copy, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export interface MFAComponentProps {
  /** Mode: setup or verify */
  mode: 'setup' | 'verify';
  /** Issuer name (e.g., "AIVO Learning") */
  issuer: string;
  /** Account name (e.g., user email) */
  accountName: string;
  /** For verify mode: the user's MFA secret */
  secret?: string;
  /** Backup codes for verification */
  backupCodes?: string[];
  /** Called when setup is complete */
  onSetupComplete?: (secret: string, backupCodes: string[]) => void;
  /** Called when verification succeeds */
  onVerifySuccess?: () => void;
  /** Called on error */
  onError?: (error: Error) => void;
}

export function MFAComponent({
  mode,
  issuer,
  accountName,
  secret: providedSecret,
  backupCodes: providedBackupCodes = [],
  onSetupComplete,
  onVerifySuccess,
  onError,
}: MFAComponentProps) {
  const { setup, remainingTime, isVerifying, setupMFA, verify, verifyBackupCode } = useMFA();
  const [token, setToken] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (mode === 'setup') {
      const mfaSetup = setupMFA(issuer, accountName);
      onSetupComplete?.(mfaSetup.secret, mfaSetup.backupCodes);
    }
  }, [mode, issuer, accountName]);

  const handleCopySecret = () => {
    if (setup) {
      navigator.clipboard.writeText(setup.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = async () => {
    if (!providedSecret || !token) return;

    try {
      setVerifyStatus('idle');

      let isValid = false;

      if (useBackupCode) {
        isValid = verifyBackupCode(token, providedBackupCodes);
      } else {
        isValid = await verify({
          secret: providedSecret,
          token: token.replace(/\s/g, ''),
          window: 1,
        });
      }

      if (isValid) {
        setVerifyStatus('success');
        onVerifySuccess?.();
      } else {
        setVerifyStatus('error');
        onError?.(new Error('Invalid code'));
      }
    } catch (err) {
      setVerifyStatus('error');
      onError?.(err as Error);
    }
  };

  if (mode === 'setup' && setup) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Setup Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg p-6 mb-4">
            <p className="text-sm text-gray-700 mb-4 text-center">
              Scan this QR code with your authenticator app
            </p>
            <div className="flex justify-center">
              <QRCodeSVG value={setup.qrCodeUrl} size={200} level="M" />
            </div>
          </div>

          {/* Manual Entry */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2 font-medium">Or enter this code manually:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-sm break-all">
                {setup.secret}
              </code>
              <button
                onClick={handleCopySecret}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Backup Codes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">⚠️ Backup Codes</h4>
            <p className="text-sm text-gray-700 mb-3">
              Save these codes in a safe place. You can use them to access your account if you lose your device.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {setup.backupCodes.map((code, i) => (
                <code key={i} className="bg-white px-3 py-2 rounded font-mono text-sm text-center">
                  {code}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'verify') {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Enter the code from your authenticator app</p>
            </div>
          </div>

          {/* Token Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {useBackupCode ? 'Backup Code' : 'Authentication Code'}
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={useBackupCode ? 'xxxx-xxxx-xxxx-xxxx' : '000000'}
                maxLength={useBackupCode ? 19 : 6}
                className="w-full px-4 py-3 text-2xl font-mono text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              {!useBackupCode && (
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Code expires in {remainingTime}s</span>
                </div>
              )}
            </div>

            {verifyStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Verification successful!</span>
              </div>
            )}

            {verifyStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Invalid code. Please try again.</span>
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={!token || isVerifying}
              className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              onClick={() => setUseBackupCode(!useBackupCode)}
              className="w-full text-sm text-blue-600 hover:text-blue-700"
            >
              {useBackupCode ? 'Use authenticator code' : 'Use backup code instead'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
