const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Envoyer un message
exports.sendMessage = async (req, res) => {
  const { conversation, sender, text } = req.body;
  try {
    const newMessage = new Message({ conversation, sender, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtenir les messages d'une conversation
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversation: conversationId }).populate('sender', 'name');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Créer une conversation
exports.createConversation = async (req, res) => {
  const { participants } = req.body;
  try {
    const newConversation = new Conversation({ participants });
    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
