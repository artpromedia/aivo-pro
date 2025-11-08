/**
 * Biometric Authentication
 * WebAuthn API for fingerprint, Face ID, Touch ID, Windows Hello
 */

export interface BiometricCredential {
  id: string;
  publicKey: ArrayBuffer;
  counter: number;
  deviceName: string;
  createdAt: Date;
}

export interface BiometricAuthOptions {
  /** Challenge from server */
  challenge: ArrayBuffer;
  /** Relying party info */
  rpId: string;
  rpName: string;
  /** User info */
  userId: ArrayBuffer;
  userName: string;
  userDisplayName: string;
  /** Timeout in ms */
  timeout?: number;
  /** Attestation type */
  attestation?: AttestationConveyancePreference;
}

export interface BiometricVerifyOptions {
  challenge: ArrayBuffer;
  credentialId: string;
  rpId: string;
  timeout?: number;
}

class BiometricAuth {
  private isSupported: boolean = false;

  constructor() {
    this.checkSupport();
  }

  /**
   * Check if WebAuthn is supported
   */
  private checkSupport(): void {
    this.isSupported =
      typeof window !== 'undefined' &&
      window.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential === 'function';
  }

  /**
   * Check if biometric authentication is available
   */
  async isAvailable(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      // Check if platform authenticator is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Register a new biometric credential
   */
  async register(options: BiometricAuthOptions): Promise<Credential | null> {
    if (!this.isSupported) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    const publicKeyOptions: PublicKeyCredentialCreationOptions = {
      challenge: options.challenge,
      rp: {
        id: options.rpId,
        name: options.rpName,
      },
      user: {
        id: options.userId,
        name: options.userName,
        displayName: options.userDisplayName,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ES256
        { type: 'public-key', alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        requireResidentKey: false,
      },
      timeout: options.timeout || 60000,
      attestation: options.attestation || 'none',
    };

    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      });

      return credential;
    } catch (error) {
      console.error('Biometric registration error:', error);
      throw error;
    }
  }

  /**
   * Verify biometric authentication
   */
  async verify(options: BiometricVerifyOptions): Promise<Credential | null> {
    if (!this.isSupported) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
      challenge: options.challenge,
      rpId: options.rpId,
      allowCredentials: [
        {
          id: this.base64ToArrayBuffer(options.credentialId),
          type: 'public-key',
          transports: ['internal'],
        },
      ],
      userVerification: 'required',
      timeout: options.timeout || 60000,
    };

    try {
      const credential = await navigator.credentials.get({
        publicKey: publicKeyOptions,
      });

      return credential;
    } catch (error) {
      console.error('Biometric verification error:', error);
      throw error;
    }
  }

  /**
   * Get available authenticator types
   */
  async getAuthenticatorInfo(): Promise<{
    uvpa: boolean; // User Verifying Platform Authenticator
    conditionalMediation: boolean;
  }> {
    const info = {
      uvpa: false,
      conditionalMediation: false,
    };

    if (!this.isSupported) return info;

    try {
      info.uvpa = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) {
      console.warn('Could not check UVPA availability');
    }

    try {
      if ('isConditionalMediationAvailable' in PublicKeyCredential) {
        info.conditionalMediation = await (
          PublicKeyCredential as any
        ).isConditionalMediationAvailable();
      }
    } catch (e) {
      console.warn('Could not check conditional mediation availability');
    }

    return info;
  }

  /**
   * Helper: Convert base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Helper: Convert ArrayBuffer to base64
   */
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Generate random challenge
   */
  generateChallenge(length: number = 32): ArrayBuffer {
    return window.crypto.getRandomValues(new Uint8Array(length)).buffer;
  }
}

// Singleton instance
export const biometricAuth = new BiometricAuth();

/**
 * Check if biometric auth is available
 */
export async function isBiometricAvailable(): Promise<boolean> {
  return biometricAuth.isAvailable();
}

/**
 * Register biometric credential
 */
export async function registerBiometric(
  options: BiometricAuthOptions
): Promise<Credential | null> {
  return biometricAuth.register(options);
}

/**
 * Verify biometric credential
 */
export async function verifyBiometric(
  options: BiometricVerifyOptions
): Promise<Credential | null> {
  return biometricAuth.verify(options);
}
