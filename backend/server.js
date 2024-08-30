const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userFromDb = require('./routes/userFromDb');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const User = require('./models/User'); // Importer le modèle d'utilisateur

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/usersfromdb', userFromDb);

const onlineUsers = new Map(); // Un Map pour suivre les utilisateurs en ligne

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Lorsque l'utilisateur s'identifie
  socket.on('userOnline', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User with ID: ${userId} is online.`);
    io.emit('updateUserStatus', { userId, status: 'online' });
  });

  // Join a conversation
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User with ID: ${socket.id} joined conversation: ${conversationId}`);
  });

  // Handle sending a message
  socket.on('sendMessage', async (messageData) => {
    const { conversation, sender, text } = messageData;
    
    try {
      // Save the message to the database
      const newMessage = new Message({ conversation, sender, text });
      await newMessage.save();

      // Broadcast the message to others in the same conversation
      io.to(conversation).emit('receiveMessage', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Trouver l'utilisateur qui s'est déconnecté
    const disconnectedUser = [...onlineUsers.entries()].find(([userId, socketId]) => socketId === socket.id);
    
    if (disconnectedUser) {
      const [userId] = disconnectedUser;
      onlineUsers.delete(userId);
      console.log(`User with ID: ${userId} is offline.`);
      io.emit('updateUserStatus', { userId, status: 'offline' });
    }

    console.log('A user disconnected:', socket.id);
  });
});

// Define the port to use
const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
