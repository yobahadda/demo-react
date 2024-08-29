import React, { useState, useEffect } from 'react';
import { getConversations } from '../services/chatService'; // Assure-toi d'avoir ce service
import { useAuth } from '../context/AuthContext';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth(); // Utilisateur authentifié

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        const convos = await getConversations(user._id); // Récupère les conversations de l'utilisateur
        setConversations(convos);
      } catch (error) {
        console.error('Erreur lors de la récupération des conversations', error);
      }
    };

    fetchConversations();
  }, [user]);

  return (
    <div>
      <h2>Mes Conversations</h2>
      <ul>
        {conversations.length > 0 ? (
          conversations.map(convo => (
            <li key={convo._id}>
              <a href={`/chat/${convo._id}`}>{convo.name || 'Conversation avec un utilisateur'}</a>
            </li>
          ))
        ) : (
          <p>Aucune conversation trouvée.</p>
        )}
      </ul>
    </div>
  );
};

export default Conversations;
