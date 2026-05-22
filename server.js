import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// Initialize Socket.io to allow frontend connections
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Event listener for user connections
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Listen for message events from users
  socket.on('send_message', (data) => {
    // Broadcast the message immediately to everyone else
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('Chat server is running successfully!');
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});