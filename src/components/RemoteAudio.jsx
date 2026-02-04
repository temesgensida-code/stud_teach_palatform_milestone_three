import React, { useEffect, useRef } from 'react';

const RemoteAudio = ({ stream }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    // If we have a stream and the audio element exists, attach them
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <div style={{ marginTop: '10px' }}>
      <label>Remote Audio Output:</label>
      <audio 
        ref={audioRef} 
        autoPlay 
        controls={false} // Hidden as it's a direct P2P stream
      />
    </div>
  );
};

export default RemoteAudio;