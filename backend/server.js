const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const cors = require('cors');

// Removed incorrect import of { Server } from 'lucide-react'
const app = express();

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
