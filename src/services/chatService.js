import axios from 'axios';

const API_URL = 'http://localhost:5001/api/chat';

// Créer une conversation
export const createConversation = async (userId, participantId) => {
  try {
    const response = await axios.post(`${API_URL}/conversations`, { userId, participantId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la création de la conversation');
  }
};

// Obtenir les conversations de l'utilisateur
export const getConversations = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/conversations/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des conversations');
  }
};

// Obtenir les messages d'une conversation
export const getMessages = async (conversationId) => {
  try {
    const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des messages');
  }
};

// Envoyer un message
export const sendMessage = async (conversationId, senderId, text) => {
  try {
    const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages`, { senderId, text });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de l\'envoi du message');
  }
};
