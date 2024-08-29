import React, { useState, useEffect } from 'react';
import { getUsers } from '../services/userService'; // Assure-toi d'avoir ce service
import { createConversation } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const UserList = ({ setSelectedConversation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Utilisateur authentifié

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getUsers(); // Récupère tous les utilisateurs
        setUsers(usersList);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (selectedUser) => {
    if (!user) return;

    try {
      const conversation = await createConversation([user._id, selectedUser._id]); // Crée une conversation entre l'utilisateur connecté et l'utilisateur sélectionné
      setSelectedConversation(conversation._id); // Met à jour la conversation sélectionnée
    } catch (error) {
      console.error('Erreur lors de la création de la conversation', error);
    }
  };

  return (
    <div>
      <h2>Liste des Utilisateurs</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id} onClick={() => handleUserClick(user)}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
