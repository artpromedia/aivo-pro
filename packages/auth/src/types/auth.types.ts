export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  districtId?: string;
  createdAt: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  avatar?: string;
}

export enum UserRole {
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  STUDENT = 'STUDENT',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
  mfaCode?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  acceptedTerms: boolean;
  consentToDataProcessing: boolean;
}

export interface MFASetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface Session {
  user: User;
  tokens: AuthTokens;
  permissions: string[];
  expiresAt: number;
  lastActivity: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface MFAVerificationRequest {
  code: string;
  tempToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  requiresMFA?: boolean;
  tempToken?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthError {
  message: string;
  code: string;
  validationErrors?: ValidationError[];
}
