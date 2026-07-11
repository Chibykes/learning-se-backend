import { Server } from 'socket.io';
import type { Server as HttpServer } from 'node:http';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    console.log('socket.handshake.auth', socket.handshake);

    // In FinTech, you'd join a room based on the user's ID
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  return io;
};

// This function allows any file to get the io instance
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
