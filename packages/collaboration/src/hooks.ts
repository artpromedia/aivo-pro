/**
 * React hooks for real-time collaboration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as Y from 'yjs';
import {
  webRTCManager,
  type WebRTCEvents,
  type PeerConnection,
  type WebRTCEventDetail,
} from './webrtc';
import { collaborativeDoc, type CollaborativeDocConfig, type Awareness } from './collaborative-doc';

type SerializableData = string | number | boolean | Record<string, unknown> | unknown[] | null;

interface PresenceUser {
  id: string;
  name: string;
  joinedAt: number;
  lastSeen: number;
}

type PresenceStorage = Record<string, PresenceUser>;

interface CursorUser {
  id: string;
  name: string;
  color?: string;
}

interface CursorState {
  x: number;
  y: number;
  user: CursorUser;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  roomId: string;
}

type ChatBroadcast = { type: 'chat'; message: ChatMessage };
type TypingBroadcast = { type: 'typing'; userId: string; userName: string; typing: boolean };
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isPresenceUser = (value: unknown): value is PresenceUser =>
  isObject(value) &&
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  typeof value.joinedAt === 'number' &&
  typeof value.lastSeen === 'number';

const parsePresenceStorage = (value: string | null): PresenceStorage => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    if (isObject(parsed)) {
      return Object.entries(parsed).reduce<PresenceStorage>((acc, [id, user]) => {
        if (isPresenceUser(user)) {
          acc[id] = user;
        }
        return acc;
      }, {});
    }
  } catch {
    // ignore malformed JSON
  }
  return {};
};

const serializePresenceStorage = (presence: PresenceStorage): string =>
  JSON.stringify(presence);

const isChatBroadcast = (value: unknown): value is ChatBroadcast =>
  isObject(value) &&
  value.type === 'chat' &&
  isObject(value.message) &&
  typeof value.message.id === 'string' &&
  typeof value.message.userId === 'string' &&
  typeof value.message.userName === 'string' &&
  typeof value.message.text === 'string' &&
  typeof value.message.timestamp === 'number' &&
  typeof value.message.roomId === 'string';

const isTypingBroadcast = (value: unknown): value is TypingBroadcast =>
  isObject(value) &&
  value.type === 'typing' &&
  typeof value.userId === 'string' &&
  typeof value.userName === 'string' &&
  typeof value.typing === 'boolean';

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
  }, [events]);

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

  const sendData = useCallback((peerId: string, data: SerializableData) => {
    webRTCManager.sendData(peerId, data);
  }, []);

  const broadcast = useCallback((data: SerializableData) => {
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
  const docRef = useRef<Y.Doc | null>(null);

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

  const getMap = useCallback(<T = unknown>(name: string) => {
    return collaborativeDoc.getMap<T>(name);
  }, []);

  const getArray = useCallback(<T = unknown>(name: string) => {
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
  const [onlineUsers, setOnlineUsers] = useState<Map<string, PresenceUser>>(new Map());
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Simulate presence tracking (in production, use a real-time backend)
    const presenceKey = `presence_${roomId}`;
    const userInfo: PresenceUser = {
      id: userId,
      name: userName,
      joinedAt: Date.now(),
      lastSeen: Date.now(),
    };

    const initialPresence = parsePresenceStorage(localStorage.getItem(presenceKey));
    initialPresence[userId] = userInfo;
    localStorage.setItem(presenceKey, serializePresenceStorage(initialPresence));

    // Update presence periodically
    const interval = setInterval(() => {
      const currentPresence = parsePresenceStorage(localStorage.getItem(presenceKey));
      currentPresence[userId] = { ...userInfo, lastSeen: Date.now() };
      localStorage.setItem(presenceKey, serializePresenceStorage(currentPresence));

      // Remove stale users (not seen in 30 seconds)
      const now = Date.now();
      const activeUsers = new Map<string, PresenceUser>();
      Object.entries(currentPresence).forEach(([id, user]) => {
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
      const currentPresence = parsePresenceStorage(localStorage.getItem(presenceKey));
      delete currentPresence[userId];
      localStorage.setItem(presenceKey, serializePresenceStorage(currentPresence));
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
  const [cursors, setCursors] = useState<Map<string, CursorState>>(new Map());

  const updateCursor = useCallback((userId: string, x: number, y: number, user: CursorUser) => {
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
    const eventName = 'webrtc-event';
    const listener: EventListener = (nativeEvent) => {
      const customEvent = nativeEvent as CustomEvent<WebRTCEventDetail>;
      const payload = customEvent.detail?.data;

      if (isChatBroadcast(payload)) {
        setMessages((prev) => [...prev, payload.message]);
      } else if (isTypingBroadcast(payload)) {
        setIsTyping((prev) => {
          const newSet = new Set(prev);
          if (payload.typing) {
            newSet.add(payload.userId);
          } else {
            newSet.delete(payload.userId);
          }
          return newSet;
        });
      }
    };

    window.addEventListener(eventName, listener);
    return () => {
      window.removeEventListener(eventName, listener);
    };
  }, []);

  return {
    messages,
    isTyping: Array.from(isTyping),
    sendMessage,
    setTypingStatus,
  };
}
