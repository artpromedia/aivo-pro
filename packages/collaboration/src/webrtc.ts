/**
 * WebRTC Peer Connection Manager
 * Handles peer-to-peer video, audio, and data connections
 */

import SimplePeer from 'simple-peer';

export interface PeerConfig {
  iceServers?: RTCIceServer[];
  mediaConstraints?: MediaStreamConstraints;
}

export interface PeerConnection {
  id: string;
  peer: SimplePeer.Instance;
  stream?: MediaStream;
  dataChannel?: RTCDataChannel;
}

export interface WebRTCEvents {
  onPeerJoined?: (peerId: string) => void;
  onPeerLeft?: (peerId: string) => void;
  onStream?: (peerId: string, stream: MediaStream) => void;
  onData?: (peerId: string, data: any) => void;
  onError?: (error: Error) => void;
}

class WebRTCManager {
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private config: PeerConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
    mediaConstraints: {
      video: true,
      audio: true,
    },
  };
  private events: WebRTCEvents = {};

  /**
   * Initialize WebRTC with configuration
   */
  initialize(config?: PeerConfig, events?: WebRTCEvents): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    if (events) {
      this.events = events;
    }
  }

  /**
   * Get local media stream
   */
  async getLocalStream(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const streamConstraints = constraints || this.config.mediaConstraints;
      this.localStream = await navigator.mediaDevices.getUserMedia(streamConstraints!);
      return this.localStream;
    } catch (error) {
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Stop local stream
   */
  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }

  /**
   * Create peer connection
   */
  createPeer(peerId: string, initiator: boolean, signal?: SimplePeer.SignalData): SimplePeer.Instance {
    const peer = new SimplePeer({
      initiator,
      trickle: true,
      stream: this.localStream || undefined,
      config: {
        iceServers: this.config.iceServers,
      },
    });

    // Handle signaling
    peer.on('signal', (data: SimplePeer.SignalData) => {
      // Signal should be sent to remote peer via signaling server
      this.emit('signal', { peerId, signal: data });
    });

    // Handle stream
    peer.on('stream', (stream: MediaStream) => {
      const connection = this.peers.get(peerId);
      if (connection) {
        connection.stream = stream;
      }
      this.events.onStream?.(peerId, stream);
    });

    // Handle data channel
    peer.on('data', (data: Uint8Array) => {
      try {
        const parsed = JSON.parse(data.toString());
        this.events.onData?.(peerId, parsed);
      } catch {
        this.events.onData?.(peerId, data);
      }
    });

    // Handle connection
    peer.on('connect', () => {
      this.events.onPeerJoined?.(peerId);
    });

    // Handle close
    peer.on('close', () => {
      this.removePeer(peerId);
      this.events.onPeerLeft?.(peerId);
    });

    // Handle errors
    peer.on('error', (error: Error) => {
      this.events.onError?.(error);
    });

    // Store peer connection
    this.peers.set(peerId, { id: peerId, peer });

    // If signal provided, apply it
    if (signal) {
      peer.signal(signal);
    }

    return peer;
  }

  /**
   * Signal to peer
   */
  signalPeer(peerId: string, signal: SimplePeer.SignalData): void {
    const connection = this.peers.get(peerId);
    if (connection) {
      connection.peer.signal(signal);
    }
  }

  /**
   * Send data to peer
   */
  sendData(peerId: string, data: any): void {
    const connection = this.peers.get(peerId);
    if (connection && connection.peer) {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      connection.peer.send(dataString);
    }
  }

  /**
   * Broadcast data to all peers
   */
  broadcast(data: any): void {
    this.peers.forEach((connection) => {
      this.sendData(connection.id, data);
    });
  }

  /**
   * Remove peer connection
   */
  removePeer(peerId: string): void {
    const connection = this.peers.get(peerId);
    if (connection) {
      connection.peer.destroy();
      this.peers.delete(peerId);
    }
  }

  /**
   * Get peer connection
   */
  getPeer(peerId: string): PeerConnection | undefined {
    return this.peers.get(peerId);
  }

  /**
   * Get all peers
   */
  getAllPeers(): PeerConnection[] {
    return Array.from(this.peers.values());
  }

  /**
   * Toggle local audio
   */
  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  /**
   * Toggle local video
   */
  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  /**
   * Get local stream stats
   */
  isAudioEnabled(): boolean {
    if (!this.localStream) return false;
    const audioTrack = this.localStream.getAudioTracks()[0];
    return audioTrack?.enabled ?? false;
  }

  isVideoEnabled(): boolean {
    if (!this.localStream) return false;
    const videoTrack = this.localStream.getVideoTracks()[0];
    return videoTrack?.enabled ?? false;
  }

  /**
   * Share screen
   */
  async shareScreen(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      this.peers.forEach((connection) => {
        const peer = connection.peer as any;
        const sender = peer._pc
          ?.getSenders()
          .find((s: RTCRtpSender) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      // Handle screen share stop
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      return screenStream;
    } catch (error) {
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Stop screen sharing
   */
  stopScreenShare(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      this.peers.forEach((connection) => {
        const peer = connection.peer as any;
        const sender = peer._pc
          ?.getSenders()
          .find((s: RTCRtpSender) => s.track?.kind === 'video');
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
    }
  }

  /**
   * Cleanup all connections
   */
  cleanup(): void {
    this.peers.forEach((connection) => {
      connection.peer.destroy();
    });
    this.peers.clear();
    this.stopLocalStream();
  }

  /**
   * Event emitter helper
   */
  private emit(event: string, data: any): void {
    // This should be connected to a signaling mechanism
    // For now, it's a placeholder for custom event handling
    window.dispatchEvent(
      new CustomEvent('webrtc-event', { detail: { event, data } })
    );
  }
}

// Singleton instance
export const webRTCManager = new WebRTCManager();

/**
 * Initialize WebRTC
 */
export function initializeWebRTC(config?: PeerConfig, events?: WebRTCEvents): void {
  webRTCManager.initialize(config, events);
}

/**
 * Get local media stream
 */
export async function getLocalStream(
  constraints?: MediaStreamConstraints
): Promise<MediaStream> {
  return webRTCManager.getLocalStream(constraints);
}

/**
 * Create peer connection
 */
export function createPeer(
  peerId: string,
  initiator: boolean,
  signal?: SimplePeer.SignalData
): SimplePeer.Instance {
  return webRTCManager.createPeer(peerId, initiator, signal);
}
