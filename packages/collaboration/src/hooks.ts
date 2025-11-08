/**
 * React hooks for real-time collaboration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { webRTCManager, type WebRTCEvents, type PeerConnection } from './webrtc';
import { collaborativeDoc, type CollaborativeDocConfig, type Awareness } from './collaborative-doc';

/**
 * Hook for WebRTC video/audio calls
 */
export function useWebRTC(events?: WebRTCEvents) {
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    webRTCManager.initialize(undefined, {
      ...events,
      onPeerJoined: (peerId) => {
        setPeers(webRTCManager.getAllPeers());
        events?.onPeerJoined?.(peerId);
      },
      onPeerLeft: (peerId) => {
        setPeers(webRTCManager.getAllPeers());
        events?.onPeerLeft?.(peerId);
      },
      onError: (err) => {
        setError(err);
        events?.onError?.(err);
      },
    });

    return () => {
      webRTCManager.cleanup();
    };
  }, []);

  const startCall = useCallback(async (constraints?: MediaStreamConstraints) => {
    try {
      const stream = await webRTCManager.getLocalStream(constraints);
      setLocalStream(stream);
      setIsAudioEnabled(webRTCManager.isAudioEnabled());
      setIsVideoEnabled(webRTCManager.isVideoEnabled());
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const endCall = useCallback(() => {
    webRTCManager.stopLocalStream();
    setLocalStream(null);
  }, []);

  const toggleAudio = useCallback(() => {
    const newState = !isAudioEnabled;
    webRTCManager.toggleAudio(newState);
    setIsAudioEnabled(newState);
  }, [isAudioEnabled]);

  const toggleVideo = useCallback(() => {
    const newState = !isVideoEnabled;
    webRTCManager.toggleVideo(newState);
    setIsVideoEnabled(newState);
  }, [isVideoEnabled]);

  const shareScreen = useCallback(async () => {
    try {
      await webRTCManager.shareScreen();
      setIsScreenSharing(true);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    webRTCManager.stopScreenShare();
    setIsScreenSharing(false);
  }, []);

  const sendData = useCallback((peerId: string, data: any) => {
    webRTCManager.sendData(peerId, data);
  }, []);

  const broadcast = useCallback((data: any) => {
    webRTCManager.broadcast(data);
  }, []);

  return {
    peers,
    localStream,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    error,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    shareScreen,
    stopScreenShare,
    sendData,
    broadcast,
  };
}

/**
 * Hook for collaborative document editing
 */
export function useCollaborativeDoc(config: CollaborativeDocConfig | null) {
  const [awareness, setAwareness] = useState<Awareness[]>([]);
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [isInitialized, setIsInitialized] = useState(false);
  const docRef = useRef<any>(null);

  useEffect(() => {
    if (!config) return;

    // Initialize document
    docRef.current = collaborativeDoc.initialize(config);
    setIsInitialized(true);

    // Update status
    const statusInterval = setInterval(() => {
      setStatus(collaborativeDoc.getStatus());
    }, 1000);

    // Subscribe to awareness changes
    const unsubscribe = collaborativeDoc.onAwarenessChange((newAwareness) => {
      setAwareness(newAwareness);
    });

    return () => {
      clearInterval(statusInterval);
      unsubscribe();
      collaborativeDoc.disconnect();
      setIsInitialized(false);
    };
  }, [config]);

  const getText = useCallback((name?: string) => {
    return collaborativeDoc.getText(name);
  }, []);

  const getMap = useCallback(<T = any>(name: string) => {
    return collaborativeDoc.getMap<T>(name);
  }, []);

  const getArray = useCallback(<T = any>(name: string) => {
    return collaborativeDoc.getArray<T>(name);
  }, []);

  const setCursor = useCallback((anchor: number, head: number) => {
    collaborativeDoc.setCursor(anchor, head);
  }, []);

  return {
    doc: docRef.current,
    awareness,
    status,
    isInitialized,
    getText,
    getMap,
    getArray,
    setCursor,
  };
}

/**
 * Hook for presence awareness (who's online)
 */
export function usePresence(roomId: string, userId: string, userName: string) {
  const [onlineUsers, setOnlineUsers] = useState<Map<string, any>>(new Map());
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Simulate presence tracking (in production, use a real-time backend)
    const presenceKey = `presence_${roomId}`;
    const userInfo = {
      id: userId,
      name: userName,
      joinedAt: Date.now(),
      lastSeen: Date.now(),
    };

    // Store user presence
    const storedPresence = localStorage.getItem(presenceKey);
    const presence = storedPresence ? JSON.parse(storedPresence) : {};
    presence[userId] = userInfo;
    localStorage.setItem(presenceKey, JSON.stringify(presence));

    // Update presence periodically
    const interval = setInterval(() => {
      const currentPresence = JSON.parse(localStorage.getItem(presenceKey) || '{}');
      currentPresence[userId] = { ...userInfo, lastSeen: Date.now() };
      localStorage.setItem(presenceKey, JSON.stringify(currentPresence));

      // Remove stale users (not seen in 30 seconds)
      const now = Date.now();
      const activeUsers = new Map();
      Object.entries(currentPresence).forEach(([id, user]: [string, any]) => {
        if (now - user.lastSeen < 30000) {
          activeUsers.set(id, user);
        }
      });

      setOnlineUsers(activeUsers);
      setUserCount(activeUsers.size);
    }, 5000);

    return () => {
      clearInterval(interval);
      // Remove user from presence
      const currentPresence = JSON.parse(localStorage.getItem(presenceKey) || '{}');
      delete currentPresence[userId];
      localStorage.setItem(presenceKey, JSON.stringify(currentPresence));
    };
  }, [roomId, userId, userName]);

  return {
    onlineUsers,
    userCount,
    isAlone: userCount <= 1,
  };
}

/**
 * Hook for cursor tracking in collaborative editing
 */
export function useCursorTracking() {
  const [cursors, setCursors] = useState<Map<string, { x: number; y: number; user: any }>>(
    new Map()
  );

  const updateCursor = useCallback((userId: string, x: number, y: number, user: any) => {
    setCursors((prev) => {
      const newCursors = new Map(prev);
      newCursors.set(userId, { x, y, user });
      return newCursors;
    });

    // Remove cursor after 3 seconds of inactivity
    setTimeout(() => {
      setCursors((prev) => {
        const newCursors = new Map(prev);
        newCursors.delete(userId);
        return newCursors;
      });
    }, 3000);
  }, []);

  const removeCursor = useCallback((userId: string) => {
    setCursors((prev) => {
      const newCursors = new Map(prev);
      newCursors.delete(userId);
      return newCursors;
    });
  }, []);

  return {
    cursors,
    updateCursor,
    removeCursor,
  };
}

/**
 * Hook for real-time chat
 */
export function useChat(roomId: string, userId: string, userName: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<Set<string>>(new Set());

  const sendMessage = useCallback(
    (text: string) => {
      const message = {
        id: `${Date.now()}_${userId}`,
        userId,
        userName,
        text,
        timestamp: Date.now(),
        roomId,
      };

      setMessages((prev) => [...prev, message]);

      // In production, send to backend
      webRTCManager.broadcast({ type: 'chat', message });
    },
    [roomId, userId, userName]
  );

  const setTypingStatus = useCallback(
    (typing: boolean) => {
      webRTCManager.broadcast({
        type: 'typing',
        userId,
        userName,
        typing,
      });
    },
    [userId, userName]
  );

  useEffect(() => {
    // Listen for chat messages from peers
    const handler = (event: CustomEvent) => {
      const { data } = event.detail;
      if (data.type === 'chat') {
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === 'typing') {
        setIsTyping((prev) => {
          const newSet = new Set(prev);
          if (data.typing) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    };

    window.addEventListener('webrtc-event' as any, handler as any);
    return () => {
      window.removeEventListener('webrtc-event' as any, handler as any);
    };
  }, []);

  return {
    messages,
    isTyping: Array.from(isTyping),
    sendMessage,
    setTypingStatus,
  };
}
