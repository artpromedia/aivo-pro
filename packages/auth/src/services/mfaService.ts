import { MFASetupResponse } from '../types/auth.types';
import QRCode from 'qrcode';

class MFAService {
  private generateSecret(): string {
    // Generate a 32-character base32 secret
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate 8-digit backup codes
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();
      codes.push(code.slice(0, 4) + '-' + code.slice(4));
    }
    return codes;
  }

  async setupMFA(userEmail: string, issuer: string = 'AIVO Learning'): Promise<MFASetupResponse> {
    const secret = this.generateSecret();
    const backupCodes = this.generateBackupCodes();
    
    // Create TOTP URL for QR code
    const totpUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    
    try {
      const qrCode = await QRCode.toDataURL(totpUrl);
      
      return {
        secret,
        qrCode,
        backupCodes,
      };
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  verifyTOTPCode(code: string, secret: string): boolean {
    // This is a simplified TOTP implementation
    // In production, use a proper TOTP library like 'otplib'
    const timeWindow = Math.floor(Date.now() / 1000 / 30);
    
    // Check current time window and adjacent windows for clock drift
    for (let i = -1; i <= 1; i++) {
      const expectedCode = this.generateTOTPCode(secret, timeWindow + i);
      if (code === expectedCode) {
        return true;
      }
    }
    
    return false;
  }

  private generateTOTPCode(secret: string, timeWindow: number): string {
    // Simplified TOTP generation - in production use a proper crypto library
    // This is just for demonstration purposes
    const hash = this.hmacSha1(secret, timeWindow.toString());
    const code = (hash % 1000000).toString().padStart(6, '0');
    return code;
  }

  private hmacSha1(secret: string, message: string): number {
    // Simplified hash function - replace with proper HMAC-SHA1 in production
    let hash = 0;
    const combined = secret + message;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash);
  }

  validateBackupCode(code: string, validCodes: string[]): boolean {
    return validCodes.includes(code);
  }

  formatBackupCodes(codes: string[]): string {
    return codes
      .map((code, index) => `${index + 1}. ${code}`)
      .join('\n');
  }

  // Generate recovery instructions
  getRecoveryInstructions(): string {
    return `
MFA Recovery Instructions:

1. Save your backup codes in a secure location
2. Each backup code can only be used once
3. If you lose access to your authenticator app, use a backup code to login
4. Contact support if you lose both your authenticator and backup codes
5. You can regenerate backup codes from your security settings

Keep these codes secure and never share them with anyone.
    `.trim();
  }
}

export const mfaService = new MFAService();
