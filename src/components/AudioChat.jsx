import React, { useState } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import RemoteAudio from './RemoteAudio';

const AudioChat = ({ roomId }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const { startCall, remoteStream } = useWebRTC(roomId);

  const handleJoin = async () => {
    setHasJoined(true);
    await startCall();
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Audio Room: {roomId}</h2>
      
      {!hasJoined ? (
        <button onClick={handleJoin} className="join-btn">
          Join Audio Call
        </button>
      ) : (
        <div className="status">
          <p>🎙️ Microphone Active</p>
          {remoteStream ? (
            <p style={{ color: 'green' }}>● Peer Connected</p>
          ) : (
            <p style={{ color: 'orange' }}>○ Waiting for Peer...</p>
          )}
        </div>
      )}

      {/* Logic for handling the remote audio stream */}
      <RemoteAudio stream={remoteStream} />
    </div>
  );
};

export default AudioChat;