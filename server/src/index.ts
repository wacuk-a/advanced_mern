import 'dotenv/config';  // Load environment variables first
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database';
import jsonrpcRouter from './routes/jsonrpc';
import socketHandler from './socket/socketHandler';
import logger from './utils/logger';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jsonrpc', jsonrpcRouter);

// Socket.io
socketHandler(io);

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export { io };
