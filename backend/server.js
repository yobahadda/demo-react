const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const cors = require('cors');
const User = require('./models/User'); 
const http = require('http');
const { Server } = require('socket.io');// Make sure to import the User model

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

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find(); // Make sure `User` is properly defined and imported
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

// Define the port to use
const PORT = process.env.PORT || 5001;

// Corrected the way to start the server using app.listen()
server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
