const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, createConversation } = require('../controllers/chatController');

// Route pour envoyer un message
router.post('/messages', sendMessage);

// Route pour obtenir les messages d'une conversation
router.get('/messages/:conversationId', getMessages);

// Route pour créer une conversation
router.post('/conversations', createConversation);

module.exports = router;
