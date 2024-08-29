import React from 'react';
import Chat from '../components/Chat'; // Assure-toi que ce composant existe

const ChatRoom = ({ match }) => {
  const { id } = match.params; // Récupère l'ID de la conversation depuis l'URL

  return (
    <div>
      <h1>Chat Room</h1>
      <Chat conversationId={id} />
    </div>
  );
};

export default ChatRoom;
