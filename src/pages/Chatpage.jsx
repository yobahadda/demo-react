import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock user data
  const users = [
    { id: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'Hey, how are you?' },
    { id: 2, name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2', lastMessage: 'Can we meet tomorrow?' },
    { id: 3, name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?img=3', lastMessage: 'Thanks for your help!' },
    { id: 4, name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?img=4', lastMessage: 'The project is done.' },
    { id: 5, name: 'Ethan Hunt', avatar: 'https://i.pravatar.cc/150?img=5', lastMessage: 'Mission accomplished!' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/');
  };

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

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedUser === user ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
              <div className="flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-4 text-red-500 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut size={20} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main chat area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full mr-4" />
              <h2 className="font-semibold text-lg">{selectedUser.name}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Phone size={20} />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Video size={20} />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {/* You can add message bubbles here */}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 px-6 py-4 flex items-center">
            <button type="button" className="text-gray-500 hover:text-gray-700 mr-4">
              <Smile size={24} />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700 mr-4">
              <Paperclip size={24} />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="ml-4 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-2xl text-gray-500">Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;