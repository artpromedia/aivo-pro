import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { useMFA } from '../hooks/useMFA';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Copy, Check, RefreshCw, Smartphone } from 'lucide-react';

const mfaSetupSchema = z.object({
  verificationCode: z.string().length(6, 'Verification code must be 6 digits'),
});

type MFASetupData = z.infer<typeof mfaSetupSchema>;

interface MFASetupProps {
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

export const MFASetup: React.FC<MFASetupProps> = ({
  onComplete,
  onSkip,
  className = '',
}) => {
  const { 
    setupTOTP, 
    verifyTOTP, 
    generateBackupCodes,
    loading, 
    error, 
    clearError 
  } = useMFA();
  
  const [step, setStep] = useState<'generate' | 'verify' | 'backup' | 'complete'>('generate');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    reset,
  } = useForm<MFASetupData>({
    resolver: zodResolver(mfaSetupSchema),
  });

  useEffect(() => {
    if (step === 'generate') {
      generateQRCode();
    }
  }, [step]);

  const generateQRCode = async () => {
    try {
      const result = await setupTOTP();
      setQrCode(result.qrCode);
      setSecret(result.secret);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const onVerify = async (data: MFASetupData) => {
    clearError();

    try {
      await verifyTOTP(data.verificationCode);
      setStep('backup');
      generateBackupCodes();
    } catch (error: any) {
      setFormError('verificationCode', {
        message: 'Invalid verification code. Please try again.',
      });
    }
  };

  const generateBackupCodesHandler = async () => {
    try {
      const codes = await generateBackupCodes();
      setBackupCodes(codes);
    } catch (error) {
      console.error('Failed to generate backup codes:', error);
    }
  };

  const copyToClipboard = async (text: string, type: 'secret' | 'codes') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'secret') {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else {
        setCopiedCodes(true);
        setTimeout(() => setCopiedCodes(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleComplete = () => {
    setStep('complete');
    onComplete?.();
  };

  const renderStep = () => {
    switch (step) {
      case 'generate':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Set Up Two-Factor Authentication
              </h2>
              <p className="text-gray-600">
                Secure your account with an authenticator app
              </p>
            </div>

            {qrCode && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block">
                  <QRCodeSVG value={qrCode} size={200} />
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Scan this QR code with your authenticator app
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    Or enter this code manually:
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono">
                      {secret}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(secret, 'secret')}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {copiedSecret ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => generateQRCode()}
                loading={loading}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep('verify')}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 'verify':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Setup
              </h2>
              <p className="text-gray-600">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onVerify)} className="space-y-6">
              <div className="space-y-2">
                <input
                  {...register('verificationCode')}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  className="block w-full text-center text-2xl font-mono py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                  autoComplete="one-time-code"
                />
                {errors.verificationCode && (
                  <p className="text-sm text-red-600">{errors.verificationCode.message}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep('generate');
                    reset();
                    clearError();
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  Verify
                </Button>
              </div>
            </form>
          </div>
        );

      case 'backup':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Save Your Backup Codes
              </h2>
              <p className="text-gray-600">
                Store these codes safely. You can use them to access your account if you lose your phone.
              </p>
            </div>

            {backupCodes.length > 0 && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <code key={index} className="bg-white px-3 py-2 rounded-lg text-sm font-mono">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(backupCodes.join('\n'), 'codes')}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {copiedCodes ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Codes
                    </>
                  )}
                </button>

                <div className="text-xs text-gray-500 max-w-md mx-auto">
                  ⚠️ Each backup code can only be used once. Store them securely and don't share them with anyone.
                </div>
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleComplete}
              className="w-full"
              size="lg"
            >
              Complete Setup
            </Button>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                All Set! 🎉
              </h2>
              <p className="text-gray-600">
                Two-factor authentication is now enabled on your account
              </p>
            </div>

            <Button
              variant="primary"
              onClick={onComplete}
              className="w-full"
              size="lg"
            >
              Continue to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-md bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      {renderStep()}
      
      {step !== 'complete' && onSkip && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
};