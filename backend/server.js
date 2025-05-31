const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); // Import path module
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware for /api/friends path
app.use('/api/friends', (req, res, next) => {
  console.log(`--- Incoming Friend Request ---`);
  console.log(`Path: ${req.path}`);
  console.log(`Method: ${req.method}`);
  // You can add more details here if needed, e.g., req.headers
  next(); // Continue to the next middleware/route handler
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
// app.use('/api/quizzes', require('./routes/quizRoutes'));

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);

  // Join user's personal room
  socket.join(socket.userId);

  // Handle joining a chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
  });

  // Handle leaving a chat room
  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
  });

  // Handle new messages
  socket.on('send-message', async (data) => {
    const { chatId, message } = data;
    io.to(chatId).emit('new-message', {
      chatId,
      message
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    // Assumes your frontend build output is in a 'dist' folder in the root of the project
    app.use(express.static(path.join(process.cwd(), 'dist')));

    // Serve index.html for all other routes
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 