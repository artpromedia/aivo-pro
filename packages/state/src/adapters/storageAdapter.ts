import { openDB, type IDBPDatabase } from 'idb';

interface StateDB {
  state: {
    key: string;
    value: unknown;
  };
}

class StorageAdapter {
  private db: IDBPDatabase<StateDB> | null = null;
  private dbName = 'aivo-state-db';
  private dbVersion = 1;

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      this.db = await openDB<StateDB>(this.dbName, this.dbVersion, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('state')) {
            db.createObjectStore('state', { keyPath: 'key' });
          }
        },
      });
    } catch (error) {
      console.warn('Failed to initialize IndexedDB, falling back to localStorage:', error);
    }
  }

  async getItem(key: string): Promise<string | null> {
    // Try IndexedDB first
    if (this.db) {
      try {
        const result = await this.db.get('state', key);
        return result?.value ? JSON.stringify(result.value) : null;
      } catch (error) {
        console.warn('IndexedDB get failed, falling back to localStorage:', error);
      }
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('localStorage get failed:', error);
        return null;
      }
    }

    return null;
  }

  async setItem(key: string, value: string): Promise<void> {
    // Try IndexedDB first
    if (this.db) {
      try {
        await this.db.put('state', { key, value: JSON.parse(value) });
        return;
      } catch (error) {
        console.warn('IndexedDB set failed, falling back to localStorage:', error);
      }
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('localStorage set failed:', error);
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    // Try IndexedDB first
    if (this.db) {
      try {
        await this.db.delete('state', key);
        return;
      } catch (error) {
        console.warn('IndexedDB remove failed, falling back to localStorage:', error);
      }
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('localStorage remove failed:', error);
      }
    }
  }

  // Clear all state data
  async clear(): Promise<void> {
    if (this.db) {
      try {
        await this.db.clear('state');
        return;
      } catch (error) {
        console.warn('IndexedDB clear failed, falling back to localStorage:', error);
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Only clear AIVO-related keys
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('aivo-')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('localStorage clear failed:', error);
      }
    }
  }

  // Get storage usage information
  async getStorageInfo(): Promise<{
    quota: number;
    usage: number;
    available: number;
  }> {
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota || 0,
          usage: estimate.usage || 0,
          available: (estimate.quota || 0) - (estimate.usage || 0)
        };
      } catch (error) {
        console.warn('Failed to get storage estimate:', error);
      }
    }

    return {
      quota: 0,
      usage: 0,
      available: 0
    };
  }
}

// Create singleton instance
const storageAdapter = new StorageAdapter();

// Initialize on module load
if (typeof window !== 'undefined') {
  storageAdapter.init().catch(console.error);
}

export { storageAdapter };