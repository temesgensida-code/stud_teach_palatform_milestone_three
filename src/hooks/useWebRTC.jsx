import { useEffect, useRef, useState } from 'react';
import { socket } from '../services/socket';

export const useWebRTC = (roomId) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const pc = useRef(null);
  const localStream = useRef(null);

  const iceConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  const cleanup = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    setRemoteStream(null);
  };

  const initConnection = async () => {
    if (pc.current) return; // Prevent double initialization

    pc.current = new RTCPeerConnection(iceConfig);

    pc.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', { roomId, signal: event.candidate });
      }
    };

    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current.getTracks().forEach(track => {
        pc.current.addTrack(track, localStream.current);
      });
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const startCall = async () => {
    await initConnection();
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.emit('signal', { roomId, signal: offer });
  };

  useEffect(() => {
    socket.emit('join-room', roomId);

    socket.on('signal', async ({ signal }) => {
  try {
    if (signal.type === 'offer') {
      await initConnection();
      
      // Only set offer if we are not already busy
      if (pc.current.signalingState !== "stable") {
        console.log("Signaling state busy, ignoring duplicate offer");
        return;
      }

      await pc.current.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.emit('signal', { roomId, signal: answer });

    } else if (signal.type === 'answer') {
      // FIX: Check if we are actually expecting an answer
      if (pc.current.signalingState === "have-local-offer") {
        await pc.current.setRemoteDescription(new RTCSessionDescription(signal));
      }

    } else if (signal.candidate) {
      // FIX: Only add ICE candidates if we have a remote description set
      if (pc.current.remoteDescription) {
        await pc.current.addIceCandidate(new RTCIceCandidate(signal));
      }
    }
  } catch (err) {
    console.error("WebRTC Signaling Error:", err);
  }
});

    return () => {
      socket.off('signal');
      cleanup();
    };
  }, [roomId]);

  return { startCall, remoteStream };
};