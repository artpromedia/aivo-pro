/**
 * Collaborative Document Editing with Yjs
 * Supports real-time collaborative text editing
 */

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export interface CollaborativeDocConfig {
  /** Document ID */
  docId: string;
  /** WebSocket server URL */
  wsUrl: string;
  /** Room name/ID */
  roomName: string;
  /** User info */
  user: {
    id: string;
    name: string;
    color?: string;
  };
}

export interface Awareness {
  clientId: number;
  user: {
    id: string;
    name: string;
    color: string;
    cursor?: {
      anchor: number;
      head: number;
    };
  };
}

class CollaborativeDocument {
  private ydoc: Y.Doc | null = null;
  private provider: WebsocketProvider | null = null;

  /**
   * Initialize collaborative document
   */
  initialize(config: CollaborativeDocConfig): Y.Doc {
    this.ydoc = new Y.Doc();

    // Connect to WebSocket server
    this.provider = new WebsocketProvider(
      config.wsUrl,
      config.roomName,
      this.ydoc,
      {
        connect: true,
      }
    );

    // Set user awareness info
    this.provider.awareness.setLocalStateField('user', {
      id: config.user.id,
      name: config.user.name,
      color: config.user.color || this.generateColor(),
    });

    return this.ydoc;
  }

  /**
   * Get text type for collaborative editing
   */
  getText(name: string = 'content'): Y.Text {
    if (!this.ydoc) {
      throw new Error('Document not initialized');
    }
    return this.ydoc.getText(name);
  }

  /**
   * Get map type for collaborative key-value storage
   */
  getMap<T = unknown>(name: string): Y.Map<T> {
    if (!this.ydoc) {
      throw new Error('Document not initialized');
    }
    return this.ydoc.getMap<T>(name);
  }

  /**
   * Get array type for collaborative lists
   */
  getArray<T = unknown>(name: string): Y.Array<T> {
    if (!this.ydoc) {
      throw new Error('Document not initialized');
    }
    return this.ydoc.getArray<T>(name);
  }

  /**
   * Get awareness (user presence)
   */
  getAwareness(): Awareness[] {
    if (!this.provider) {
      return [];
    }

    const awareness: Awareness[] = [];
    this.provider.awareness.getStates().forEach((state, clientId) => {
      if (state.user) {
        awareness.push({
          clientId,
          user: state.user,
        });
      }
    });

    return awareness;
  }

  /**
   * Update cursor position
   */
  setCursor(anchor: number, head: number): void {
    if (!this.provider) return;

    const currentState = this.provider.awareness.getLocalState();
    this.provider.awareness.setLocalStateField('user', {
      ...currentState?.user,
      cursor: { anchor, head },
    });
  }

  /**
   * Subscribe to awareness changes
   */
  onAwarenessChange(callback: (awareness: Awareness[]) => void): () => void {
    if (!this.provider) {
      return () => {};
    }

    const handler = () => {
      callback(this.getAwareness());
    };

    this.provider.awareness.on('change', handler);

    return () => {
      this.provider?.awareness.off('change', handler);
    };
  }

  /**
   * Subscribe to document updates
   */
  onUpdate(callback: (update: Uint8Array) => void): () => void {
    if (!this.ydoc) {
      return () => {};
    }

    const handler = (update: Uint8Array) => {
      callback(update);
    };

    this.ydoc.on('update', handler);

    return () => {
      this.ydoc?.off('update', handler);
    };
  }

  /**
   * Get document as JSON
   */
  toJSON(): ReturnType<Y.Doc['toJSON']> | null {
    if (!this.ydoc) {
      return null;
    }
    return this.ydoc.toJSON();
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.provider?.wsconnected ?? false;
  }

  /**
   * Get connection status
   */
  getStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (!this.provider) return 'disconnected';
    if (this.provider.wsconnected) return 'connected';
    if (this.provider.wsconnecting) return 'connecting';
    return 'disconnected';
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    if (this.provider) {
      this.provider.disconnect();
      this.provider.destroy();
      this.provider = null;
    }
    if (this.ydoc) {
      this.ydoc.destroy();
      this.ydoc = null;
    }
  }

  /**
   * Generate random color for user
   */
  private generateColor(): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Undo manager for collaborative undo/redo
   */
  createUndoManager(scope: Y.Text | Y.Array<unknown> | Y.Map<unknown>): Y.UndoManager {
    if (!this.ydoc) {
      throw new Error('Document not initialized');
    }
    return new Y.UndoManager(scope);
  }
}

// Singleton instance
export const collaborativeDoc = new CollaborativeDocument();

/**
 * Initialize collaborative document
 */
export function initializeCollabDoc(config: CollaborativeDocConfig): Y.Doc {
  return collaborativeDoc.initialize(config);
}

/**
 * Get collaborative text
 */
export function getCollabText(name?: string): Y.Text {
  return collaborativeDoc.getText(name);
}

/**
 * Get collaborative map
 */
export function getCollabMap<T = unknown>(name: string): Y.Map<T> {
  return collaborativeDoc.getMap<T>(name);
}

/**
 * Get collaborative array
 */
export function getCollabArray<T = unknown>(name: string): Y.Array<T> {
  return collaborativeDoc.getArray<T>(name);
}
