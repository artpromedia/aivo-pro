/**
 * Video Call Component
 */

import { useRef, useEffect } from 'react';
import { useWebRTC } from '../hooks';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff } from 'lucide-react';

export interface VideoCallProps {
  roomId: string;
  userId: string;
  userName: string;
  onEnd?: () => void;
}

export function VideoCall({ userName, onEnd }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const {
    peers,
    localStream,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    shareScreen,
    stopScreenShare,
  } = useWebRTC();

  useEffect(() => {
    startCall();
  }, [startCall]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleEndCall = () => {
    endCall();
    onEnd?.();
  };

  return (
    <div className="h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-[calc(100%-80px)]">
        {/* Local Video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            {userName} (You)
          </div>
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Remote Videos */}
        {peers.map((peer) => (
          <RemoteVideo key={peer.id} peer={peer} />
        ))}
      </div>

      {/* Controls */}
      <div className="h-20 bg-gray-800 flex items-center justify-center gap-4 px-4">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-colors ${
            isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isAudioEnabled ? (
            <Mic className="w-6 h-6 text-white" />
          ) : (
            <MicOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${
            isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isVideoEnabled ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <VideoOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={isScreenSharing ? stopScreenShare : shareScreen}
          className={`p-4 rounded-full transition-colors ${
            isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Monitor className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={handleEndCall}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}

interface RemoteVideoProps {
  peer: any;
}

function RemoteVideo({ peer }: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
        Participant {peer.id.substring(0, 8)}
      </div>
    </div>
  );
}
