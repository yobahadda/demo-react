const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, createConversation } = require('../controllers/chatController');

// Route to send a message
router.post('/messages', sendMessage);

// Route to get messages of a conversation
router.get('/messages/:conversationId', getMessages);

// Route to create or retrieve a conversation
router.post('/conversations', createConversation);

module.exports = router;
