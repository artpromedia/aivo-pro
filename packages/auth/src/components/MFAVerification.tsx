import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@aivo/ui';
import { useMFA } from '../hooks/useMFA';
import { Shield, ArrowLeft, Key } from 'lucide-react';

const mfaVerificationSchema = z.object({
  verificationCode: z.string().length(6, 'Verification code must be 6 digits'),
});

type MFAVerificationData = z.infer<typeof mfaVerificationSchema>;

interface MFAVerificationProps {
  tempToken: string;
  onSuccess?: () => void;
  onBack?: () => void;
  className?: string;
}

export const MFAVerification: React.FC<MFAVerificationProps> = ({
  tempToken,
  onSuccess,
  onBack,
  className = '',
}) => {
  const { verifyLogin, loading, error, clearError } = useMFA();
  const [useBackupCode, setUseBackupCode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    reset,
  } = useForm<MFAVerificationData>({
    resolver: zodResolver(mfaVerificationSchema),
  });

  const onSubmit = async (data: MFAVerificationData) => {
    clearError();

    try {
      await verifyLogin(data.verificationCode, tempToken);
      onSuccess?.();
    } catch (error: any) {
      setFormError('verificationCode', {
        message: 'Invalid verification code. Please try again.',
      });
    }
  };

  return (
    <div className={`w-full max-w-md bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Identity
          </h1>
          <p className="text-gray-600">
            {useBackupCode
              ? 'Enter one of your backup codes'
              : 'Enter the 6-digit code from your authenticator app'
            }
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              {useBackupCode ? (
                <Key className="w-5 h-5 text-gray-400 mr-2" />
              ) : (
                <Shield className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className="text-sm text-gray-600">
                {useBackupCode ? 'Backup Code' : 'Authenticator Code'}
              </span>
            </div>

            <input
              {...register('verificationCode')}
              type="text"
              inputMode={useBackupCode ? 'text' : 'numeric'}
              pattern={useBackupCode ? '[a-zA-Z0-9]*' : '[0-9]*'}
              maxLength={useBackupCode ? 10 : 6}
              placeholder={useBackupCode ? 'XXXXXXXX' : '000000'}
              className="block w-full text-center text-2xl font-mono py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
              autoComplete="one-time-code"
            />
            {errors.verificationCode && (
              <p className="text-sm text-red-600">{errors.verificationCode.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Verify & Continue
            </Button>

            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                reset();
                clearError();
              }}
              className="w-full text-sm text-coral-500 hover:text-coral-600 transition-colors"
            >
              {useBackupCode
                ? 'Use authenticator app instead'
                : 'Use backup code instead'
              }
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </button>
            )}
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center">
          <p>Can't access your authenticator app?</p>
          <button
            type="button"
            className="text-coral-500 hover:underline mt-1"
          >
            Contact support
          </button>
        </div>
      </div>
    </div>
  );
};