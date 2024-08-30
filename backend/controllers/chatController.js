const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Send a message
exports.sendMessage = async (req, res) => {
  const { conversation, sender, text } = req.body;

  try {
    // Create a new message
    const newMessage = new Message({
      conversation,
      sender,
      text,
    });

    // Save the message to the database
    await newMessage.save();

    // Return the saved message
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get messages of a conversation
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    // Find all messages in the conversation
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar') // Optionally populate sender's details
      .sort({ createdAt: 1 }); // Sort by creation time

    // Return the messages
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create or retrieve a conversation
exports.createConversation = async (req, res) => {
  const { participants } = req.body;

  try {
    // Find an existing conversation with the exact participants
    let conversation = await Conversation.findOne({
      participants: { $all: participants },
      $expr: { $eq: [{ $size: "$participants" }, participants.length] }
    });

    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = new Conversation({ participants });
      await conversation.save();
    }

    // Return the conversation
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};