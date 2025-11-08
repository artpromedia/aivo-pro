/**
 * Multi-Factor Authentication (MFA)
 * TOTP (Time-based One-Time Password) support
 */

import CryptoJS from 'crypto-js';

export interface MFASetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface MFAVerifyOptions {
  secret: string;
  token: string;
  window?: number; // Time window tolerance (default: 1 = ±30 seconds)
}

class MFAManager {
  private readonly TOTP_PERIOD = 30; // 30 seconds
  private readonly TOTP_DIGITS = 6;

  /**
   * Generate a new MFA secret
   */
  generateSecret(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 alphabet
    let secret = '';
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      secret += chars[randomValues[i] % chars.length];
    }

    return secret;
  }

  /**
   * Generate backup codes
   */
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = this.generateBackupCode();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Generate a single backup code
   */
  private generateBackupCode(): string {
    const randomValues = new Uint8Array(4);
    window.crypto.getRandomValues(randomValues);
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += randomValues[i].toString(16).padStart(2, '0');
    }
    return code.match(/.{1,4}/g)?.join('-') || code;
  }

  /**
   * Setup MFA for a user
   */
  setup(
    issuer: string,
    accountName: string,
    secret?: string
  ): MFASetup {
    const mfaSecret = secret || this.generateSecret();
    const qrCodeUrl = this.generateQRCodeUrl(issuer, accountName, mfaSecret);
    const backupCodes = this.generateBackupCodes();

    return {
      secret: mfaSecret,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Generate QR code URL for authenticator apps
   */
  generateQRCodeUrl(
    issuer: string,
    accountName: string,
    secret: string
  ): string {
    const label = encodeURIComponent(`${issuer}:${accountName}`);
    const params = new URLSearchParams({
      secret,
      issuer,
      algorithm: 'SHA1',
      digits: this.TOTP_DIGITS.toString(),
      period: this.TOTP_PERIOD.toString(),
    });

    return `otpauth://totp/${label}?${params.toString()}`;
  }

  /**
   * Verify TOTP token
   */
  verify(options: MFAVerifyOptions): boolean {
    const { secret, token, window = 1 } = options;

    // Check current time and ±window periods
    const currentTime = Math.floor(Date.now() / 1000);
    const currentCounter = Math.floor(currentTime / this.TOTP_PERIOD);

    for (let i = -window; i <= window; i++) {
      const counter = currentCounter + i;
      const expectedToken = this.generateTOTP(secret, counter);

      if (expectedToken === token) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generate TOTP token
   */
  generateTOTP(secret: string, counter?: number): string {
    const timeCounter =
      counter !== undefined
        ? counter
        : Math.floor(Date.now() / 1000 / this.TOTP_PERIOD);

    // Convert secret from base32
    const key = this.base32ToHex(secret);

    // Convert counter to hex (8 bytes, big-endian)
    const time = timeCounter.toString(16).padStart(16, '0');

    // Generate HMAC-SHA1
    const hmac = CryptoJS.HmacSHA1(
      CryptoJS.enc.Hex.parse(time),
      CryptoJS.enc.Hex.parse(key)
    );

    // Get dynamic offset
    const hmacHex = hmac.toString(CryptoJS.enc.Hex);
    const offset = parseInt(hmacHex.substring(hmacHex.length - 1), 16);

    // Get 4 bytes starting from offset
    const code = hmacHex.substring(offset * 2, offset * 2 + 8);
    const codeInt = parseInt(code, 16) & 0x7fffffff;

    // Generate 6-digit token
    const token = (codeInt % Math.pow(10, this.TOTP_DIGITS))
      .toString()
      .padStart(this.TOTP_DIGITS, '0');

    return token;
  }

  /**
   * Get remaining time in current period
   */
  getRemainingTime(): number {
    const currentTime = Math.floor(Date.now() / 1000);
    return this.TOTP_PERIOD - (currentTime % this.TOTP_PERIOD);
  }

  /**
   * Convert base32 to hex
   */
  private base32ToHex(base32: string): string {
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let hex = '';

    base32 = base32.replace(/=+$/, '');

    for (let i = 0; i < base32.length; i++) {
      const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
      if (val === -1) throw new Error('Invalid base32 character');
      bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
      const chunk = bits.substring(i, i + 8);
      hex += parseInt(chunk, 2).toString(16).padStart(2, '0');
    }

    return hex;
  }

  /**
   * Verify backup code
   */
  verifyBackupCode(code: string, validCodes: string[]): boolean {
    return validCodes.includes(code.toLowerCase());
  }
}

// Singleton instance
export const mfaManager = new MFAManager();

/**
 * Setup MFA for a user
 */
export function setupMFA(
  issuer: string,
  accountName: string,
  secret?: string
): MFASetup {
  return mfaManager.setup(issuer, accountName, secret);
}

/**
 * Verify MFA token
 */
export function verifyMFA(options: MFAVerifyOptions): boolean {
  return mfaManager.verify(options);
}

/**
 * Generate TOTP token (for testing/display)
 */
export function generateMFAToken(secret: string): string {
  return mfaManager.generateTOTP(secret);
}

/**
 * Get remaining time in current TOTP period
 */
export function getMFARemainingTime(): number {
  return mfaManager.getRemainingTime();
}
