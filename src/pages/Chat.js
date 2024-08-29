import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages } from '../services/chatService'; // Assure-toi d'avoir ce service
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const { user } = useAuth(); // Utilisateur authentifié

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      try {
        const msgs = await getMessages(conversationId);
        setMessages(msgs);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages', error);
      }
    };

    fetchMessages();
  }, [conversationId]);

  return (
    <div>
      <h2>Conversation</h2>
      <ul>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.senderName}: </strong>{msg.text}
            </li>
          ))
        ) : (
          <p>Aucun message trouvé.</p>
        )}
      </ul>
    </div>
  );
};

export default Chat;
