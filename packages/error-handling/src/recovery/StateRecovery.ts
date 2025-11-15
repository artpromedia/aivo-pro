export class StateRecovery {
  private storageKey = 'aivo_recovery_state';
  
  // Save current application state
  saveState(state: any): void {
    try {
      const recoveryData = {
        state,
        timestamp: Date.now(),
        version: this.getAppVersion()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(recoveryData));
    } catch (error) {
      console.warn('Failed to save recovery state:', error);
    }
  }

  // Restore saved state
  restoreState(): any | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;

      const recoveryData = JSON.parse(stored);
      
      // Check if state is not too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - recoveryData.timestamp > maxAge) {
        this.clearState();
        return null;
      }

      // Check version compatibility
      if (recoveryData.version !== this.getAppVersion()) {
        console.warn('Version mismatch, clearing recovery state');
        this.clearState();
        return null;
      }

      return recoveryData.state;
    } catch (error) {
      console.warn('Failed to restore recovery state:', error);
      this.clearState();
      return null;
    }
  }

  // Clear saved state
  clearState(): void {
    try {
      localStorage.removeItem(this.storageKey);
      sessionStorage.removeItem('aivo_session_id');
      // Clear other session data
      this.clearSessionData();
    } catch (error) {
      console.warn('Failed to clear recovery state:', error);
    }
  }

  // Clear all AIVO-related storage
  clearAll(): void {
    try {
      // Clear localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('aivo_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear sessionStorage
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('aivo_')) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

      // Clear IndexedDB databases
      this.clearIndexedDB();
    } catch (error) {
      console.warn('Failed to clear all storage:', error);
    }
  }

  // Attempt to recover from common error states
  async attemptRecovery(error: Error): Promise<boolean> {
    try {
      // Handle chunk loading errors
      if (error.message.includes('Loading chunk')) {
        return await this.handleChunkError();
      }

      // Handle network errors
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        return await this.handleNetworkError();
      }

      // Handle state corruption
      if (error.message.includes('Cannot read') || error.message.includes('undefined')) {
        return this.handleStateCorruption();
      }

      // Handle quota exceeded
      if (error.message.includes('QuotaExceededError')) {
        return this.handleQuotaError();
      }

      return false;
    } catch (recoveryError) {
      console.warn('Recovery attempt failed:', recoveryError);
      return false;
    }
  }

  private async handleChunkError(): Promise<boolean> {
    try {
      // Clear module cache
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.unregister();
        }
      }
      
      // Clear caches
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cacheStorage = window.caches;
        if (cacheStorage) {
          const cacheNames = await cacheStorage.keys();
          await Promise.all(cacheNames.map(name => cacheStorage.delete(name)));
        }
      }

      // Force reload
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      return true;
    } catch (error) {
      console.warn('Failed to handle chunk error:', error);
      return false;
    }
  }

  private async handleNetworkError(): Promise<boolean> {
    try {
      // Check network connectivity
      if (!navigator.onLine) {
        // Switch to offline mode
        this.enableOfflineMode();
        return true;
      }

      // Retry with exponential backoff
      await this.retryWithBackoff(3);
      return true;
    } catch (error) {
      console.warn('Failed to handle network error:', error);
      return false;
    }
  }

  private handleStateCorruption(): boolean {
    try {
      // Clear corrupted state
      this.clearState();
      
      // Reset to default state
      this.resetToDefaultState();
      
      return true;
    } catch (error) {
      console.warn('Failed to handle state corruption:', error);
      return false;
    }
  }

  private handleQuotaError(): boolean {
    try {
      // Clear old cached data
      this.clearOldCache();
      
      // Reduce storage usage
      this.optimizeStorage();
      
      return true;
    } catch (error) {
      console.warn('Failed to handle quota error:', error);
      return false;
    }
  }

  private getAppVersion(): string {
    return document.querySelector('meta[name="app-version"]')?.getAttribute('content') || '1.0.0';
  }

  private clearSessionData(): void {
    // Clear specific session data patterns
    const patterns = ['temp_', 'cache_', 'session_'];
    patterns.forEach(pattern => {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key?.includes(pattern)) {
          sessionStorage.removeItem(key);
        }
      }
    });
  }

  private async clearIndexedDB(): Promise<void> {
    try {
      const dbAPI = typeof window !== 'undefined' ? window.indexedDB : undefined;
      if (!dbAPI || typeof dbAPI.databases !== 'function') {
        return;
      }

      const databases = await dbAPI.databases();
      await Promise.all(
        databases
          .filter(db => db.name?.startsWith('aivo_'))
          .map(db => {
            return new Promise<void>((resolve, reject) => {
              if (!db.name) {
                resolve();
                return;
              }
              const deleteReq = dbAPI.deleteDatabase(db.name);
              deleteReq.onsuccess = () => resolve();
              deleteReq.onerror = () => reject(deleteReq.error);
            });
          })
      );
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }
  }

  private enableOfflineMode(): void {
    // Dispatch offline mode event
    if (typeof window === 'undefined' || typeof window.CustomEvent !== 'function') {
      return;
    }

    window.dispatchEvent(new window.CustomEvent('aivo:offline-mode', { detail: { enabled: true } }));
  }

  private async retryWithBackoff(maxRetries: number): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await fetch('/api/health', { method: 'HEAD' });
        return; // Success
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  private resetToDefaultState(): void {
    // Dispatch state reset event
    if (typeof window === 'undefined' || typeof window.CustomEvent !== 'function') {
      return;
    }

    window.dispatchEvent(new window.CustomEvent('aivo:state-reset'));
  }

  private clearOldCache(): void {
    // Remove items older than 7 days
    const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith('aivo_cache_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item.timestamp && item.timestamp < cutoff) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Remove invalid items
          localStorage.removeItem(key!);
        }
      }
    }
  }

  private optimizeStorage(): void {
    // Compress stored data
    // Remove non-essential cached data
    // Keep only critical user data
    const essentialKeys = ['aivo_auth_token', 'aivo_user_profile', 'aivo_current_child'];
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith('aivo_') && !essentialKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    }
  }
}