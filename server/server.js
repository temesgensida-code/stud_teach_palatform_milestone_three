const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow cross-origin requests

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allows any origin for testing; change to http://localhost:5173 for production
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`🏠 User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('signal', (data) => {
    // Forward the signal to everyone else in the room
    socket.to(data.roomId).emit('signal', {
      sender: socket.id,
      signal: data.signal
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// THIS PART IS CRUCIAL TO KEEP THE SERVER ALIVE
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Signaling server is running on http://localhost:${PORT}`);
});