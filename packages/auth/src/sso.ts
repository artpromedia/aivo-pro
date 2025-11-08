/**
 * Single Sign-On (SSO) Support
 * OAuth 2.0 / OpenID Connect implementation
 */

export interface SSOProvider {
  id: string;
  name: string;
  type: 'oauth2' | 'saml' | 'oidc';
  authUrl: string;
  tokenUrl: string;
  userInfoUrl?: string;
  clientId: string;
  scope: string[];
  icon?: string;
}

export interface SSOConfig {
  providers: SSOProvider[];
  redirectUri: string;
  state?: string;
}

export interface SSOAuthResult {
  provider: string;
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    picture?: string;
  };
}

class SSOManager {
  private config: SSOConfig | null = null;
  private pendingAuth: Map<string, { provider: string; timestamp: number }> = new Map();

  /**
   * Initialize SSO configuration
   */
  initialize(config: SSOConfig): void {
    this.config = config;
  }

  /**
   * Get configured providers
   */
  getProviders(): SSOProvider[] {
    return this.config?.providers || [];
  }

  /**
   * Start OAuth flow
   */
  async authorize(providerId: string): Promise<void> {
    if (!this.config) {
      throw new Error('SSO not initialized');
    }

    const provider = this.config.providers.find((p) => p.id === providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    // Generate state for CSRF protection
    const state = this.config.state || this.generateState();
    
    // Store pending auth
    this.pendingAuth.set(state, {
      provider: providerId,
      timestamp: Date.now(),
    });
    localStorage.setItem('sso_state', state);
    localStorage.setItem('sso_provider', providerId);

    // Generate code verifier and challenge for PKCE
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    localStorage.setItem('sso_code_verifier', codeVerifier);

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: provider.scope.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `${provider.authUrl}?${params.toString()}`;

    // Redirect to provider
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(callbackUrl: string): Promise<SSOAuthResult> {
    const url = new URL(callbackUrl);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      throw new Error(`SSO error: ${error}`);
    }

    if (!code || !state) {
      throw new Error('Invalid callback parameters');
    }

    // Verify state
    const savedState = localStorage.getItem('sso_state');
    if (state !== savedState) {
      throw new Error('State mismatch - possible CSRF attack');
    }

    const providerId = localStorage.getItem('sso_provider');
    if (!providerId) {
      throw new Error('Provider not found');
    }

    const provider = this.config?.providers.find((p) => p.id === providerId);
    if (!provider) {
      throw new Error('Provider configuration not found');
    }

    // Exchange code for tokens
    const codeVerifier = localStorage.getItem('sso_code_verifier');
    const tokenResult = await this.exchangeCode(provider, code, codeVerifier!);

    // Cleanup
    localStorage.removeItem('sso_state');
    localStorage.removeItem('sso_provider');
    localStorage.removeItem('sso_code_verifier');
    this.pendingAuth.delete(state);

    // Fetch user info if available
    let user;
    if (provider.userInfoUrl && tokenResult.accessToken) {
      user = await this.fetchUserInfo(provider, tokenResult.accessToken);
    }

    return {
      provider: providerId,
      ...tokenResult,
      user,
    };
  }

  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCode(
    provider: SSOProvider,
    code: string,
    codeVerifier: string
  ): Promise<Omit<SSOAuthResult, 'provider' | 'user'>> {
    if (!this.config) {
      throw new Error('SSO not initialized');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUri,
      client_id: provider.clientId,
      code_verifier: codeVerifier,
    });

    const response = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      scope: data.scope,
    };
  }

  /**
   * Fetch user information
   */
  private async fetchUserInfo(
    provider: SSOProvider,
    accessToken: string
  ): Promise<SSOAuthResult['user']> {
    if (!provider.userInfoUrl) {
      return undefined;
    }

    const response = await fetch(provider.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch user info');
      return undefined;
    }

    const data = await response.json();

    return {
      id: data.sub || data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  }

  /**
   * Generate random state
   */
  private generateState(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate PKCE code verifier
   */
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  /**
   * Generate PKCE code challenge
   */
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(hash));
  }

  /**
   * Base64 URL encode
   */
  private base64UrlEncode(array: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...array));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    providerId: string,
    refreshToken: string
  ): Promise<Omit<SSOAuthResult, 'provider' | 'user'>> {
    const provider = this.config?.providers.find((p) => p.id === providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: provider.clientId,
    });

    const response = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      idToken: data.id_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      scope: data.scope,
    };
  }

  /**
   * Logout from SSO provider
   */
  async logout(providerId: string, idToken?: string): Promise<void> {
    const provider = this.config?.providers.find((p) => p.id === providerId);
    if (!provider) {
      return;
    }

    // Clear local storage
    localStorage.removeItem('sso_access_token');
    localStorage.removeItem('sso_refresh_token');
    localStorage.removeItem('sso_id_token');

    // Some providers support logout endpoint
    // This would need to be configured per provider
  }
}

// Singleton instance
export const ssoManager = new SSOManager();

/**
 * Common SSO provider configurations
 */
export const SSOProviders = {
  Google: (clientId: string, redirectUri: string): SSOProvider => ({
    id: 'google',
    name: 'Google',
    type: 'oidc',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    clientId,
    scope: ['openid', 'email', 'profile'],
    icon: '🔵',
  }),

  Microsoft: (clientId: string, redirectUri: string): SSOProvider => ({
    id: 'microsoft',
    name: 'Microsoft',
    type: 'oidc',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    clientId,
    scope: ['openid', 'email', 'profile'],
    icon: '🟦',
  }),

  GitHub: (clientId: string, redirectUri: string): SSOProvider => ({
    id: 'github',
    name: 'GitHub',
    type: 'oauth2',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    clientId,
    scope: ['read:user', 'user:email'],
    icon: '⚫',
  }),
};

/**
 * Initialize SSO
 */
export function initializeSSO(config: SSOConfig): void {
  ssoManager.initialize(config);
}

/**
 * Start SSO authorization
 */
export async function authorizeSSO(providerId: string): Promise<void> {
  return ssoManager.authorize(providerId);
}

/**
 * Handle SSO callback
 */
export async function handleSSOCallback(callbackUrl: string): Promise<SSOAuthResult> {
  return ssoManager.handleCallback(callbackUrl);
}
