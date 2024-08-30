import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Search, LogOut, Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

const socket = io('http://localhost:5001');

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); // Pour gérer le groupe sélectionné
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const [conversationId, setConversationId] = useState(null);
  const [groups, setGroups] = useState([]); // État pour stocker les groupes
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  // Récupérer les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/usersfromdb', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  // Récupérer les groupes de discussion
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/chat/groups', {
          headers: {
            Authorization: `Bearer ${token}`,
            'user-id': currentUserId, // Envoyer l'ID de l'utilisateur dans les en-têtes
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    fetchGroups();
  }, [token, currentUserId]);

  useEffect(() => {
    if (conversationId) {
      socket.emit('joinConversation', conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    socket.emit('userOnline', currentUserId);

    const handleMessageReceive = (messageData) => {
      if (messageData.conversation === conversationId) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    };

    const handleUserStatusUpdate = (statusData) => {
      setUserStatuses((prevStatuses) => ({
        ...prevStatuses,
        [statusData.userId]: statusData.status,
      }));
    };

    socket.on('receiveMessage', handleMessageReceive);
    socket.on('updateUserStatus', handleUserStatusUpdate);

    return () => {
      socket.off('receiveMessage', handleMessageReceive);
      socket.off('updateUserStatus', handleUserStatusUpdate);
    };
  }, [conversationId, currentUserId]);

  const fetchMessages = async (userOrGroup) => {
    try {
      const isGroup = userOrGroup.participants !== undefined; // Vérifier si c'est un groupe
      const endpoint = isGroup
        ? `http://localhost:5001/api/chat/groupmessages/${userOrGroup._id}`
        : 'http://localhost:5001/api/chat/conversations';

      const requestBody = isGroup
        ? null
        : { participants: [currentUserId, userOrGroup._id] };

      const response = await axios.post(endpoint, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConversationId(response.data._id);

      const messagesResponse = await axios.get(
        `http://localhost:5001/api/chat/messages/${response.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(messagesResponse.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null); // Désélectionner le groupe si un utilisateur est sélectionné
    fetchMessages(user);
  };

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null); // Désélectionner l'utilisateur si un groupe est sélectionné
    fetchMessages(group);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && conversationId) {
      const messageData = {
        conversation: conversationId,
        sender: currentUserId,
        text: message,
      };

      socket.emit('sendMessage', messageData);

      try {
        await axios.post('http://localhost:5001/api/chat/messages', messageData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUserId &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Group list */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Groupes de Chat</h2>
          <div className="flex-1 overflow-y-auto">
            {groups.map((group) => (
              <div
                key={group._id}
                className={`p-4 cursor-pointer hover:bg-gray-200 ${
                  selectedGroup && selectedGroup._id === group._id ? 'bg-gray-200' : ''
                }`}
                onClick={() => handleGroupSelection(group)}
              >
                <p className="font-medium">{group.name}</p>
                <p className="text-xs text-gray-500">
                  Participants: {group.participants.map(p => p.name).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                selectedUser && selectedUser._id === user._id ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleUserSelection(user)}
            >
              <div className="flex items-center">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {userStatuses[user._id] === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
          >
            <LogOut className="inline-block mr-2" size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="w-3/4 flex flex-col">
        {/* Chat header */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          {selectedUser ? (
            <>
              <div className="flex items-center">
                <img
                  src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.name}`}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">
                    {userStatuses[selectedUser._id] === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-gray-500 cursor-pointer" size={20} />
                <Video className="text-gray-500 cursor-pointer" size={20} />
                <MoreVertical className="text-gray-500 cursor-pointer" size={20} />
              </div>
            </>
          ) : selectedGroup ? (
            <>
              <div className="flex items-center">
                <div className="bg-gray-200 w-10 h-10 rounded-full mr-3 flex items-center justify-center">
                  <p className="text-gray-500 font-semibold">
                    {selectedGroup.name.charAt(0).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">{selectedGroup.name}</p>
                  <p className="text-xs text-gray-500">Group Chat</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-gray-500 cursor-pointer" size={20} />
                <Video className="text-gray-500 cursor-pointer" size={20} />
                <MoreVertical className="text-gray-500 cursor-pointer" size={20} />
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a user or group to start chatting</p>
          )}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 p-2 rounded-md ${
                msg.sender === currentUserId ? 'bg-blue-500 text-white self-end' : 'bg-white text-black self-start'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Message input area */}
        {selectedUser || selectedGroup ? (
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                <Send size={20} />
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatPage;
