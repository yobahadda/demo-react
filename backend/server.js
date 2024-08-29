const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userFromDb = require('./routes/userFromDb');

const User = require('./models/User'); 
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');// Make sure to import the User model

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/usersfromdb', userFromDb);

// Define the port to use
const PORT = process.env.PORT || 5001;

// Corrected the way to start the server using app.listen()
server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
