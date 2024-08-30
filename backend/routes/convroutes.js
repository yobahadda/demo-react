const express = require('express');
const GroupConversation = require('../models/GroupConversation');

const router = express.Router();

// Route to create a new group conversation
router.post('/chat/groups', async (req, res) => {
  const { name, participants } = req.body;
  try {
    const groupConversation = new GroupConversation({
      name,
      participants,
    });
    await groupConversation.save();
    res.json(groupConversation);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create group' });
  }
});

// Route to get all group conversations
router.get('/chat/groups', async (req, res) => {
    const userId = req.headers['user-id']; // Supposons que l'ID utilisateur est envoyé dans les en-têtes de la requête
    try {
      const groups = await GroupConversation.find({
        participants: userId // Filtrer les groupes où l'utilisateur est un participant
      }).populate('participants');
      res.json(groups);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch groups' });
    }
  });
  
module.exports = router;
