import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Search, LogOut, Send, Smile, Paperclip, MoreVertical, Phone, Video, X } from 'lucide-react';

const socket = io('http://localhost:5001');

// Emoji data
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
  '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾',
];


// Custom UI Components
const Avatar = React.forwardRef(({ src, alt, fallback, className, ...props }, ref) => (
  <div ref={ref} className={`relative inline-block ${className}`} {...props}>
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full text-gray-600 font-semibold">
        {fallback}
      </div>
    )}
  </div>
));

const Button = React.forwardRef(({ children, variant = 'default', size = 'default', className, ...props }, ref) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500";
  const variants = {
    default: "bg-green-500 text-white hover:bg-green-600",
    ghost: "bg-transparent hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizes = {
    default: "px-4 py-2",
    sm: "px-2 py-1 text-sm",
    lg: "px-6 py-3 text-lg",
    icon: "p-2",
  };
  return (
    <button
      ref={ref}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
    {...props}
  />
));

const ScrollArea = React.forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={`overflow-auto ${className}`}
    style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #EDF2F7' }}
    {...props}
  >
    {children}
  </div>
));

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-2 py-1 text-sm text-white bg-gray-800 rounded-md shadow-lg transition-opacity duration-200 ease-in-out">
          {content}
        </div>
      )}
    </div>
  );
};

// Main ChatPage Component
const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5001/api/usersfromdb', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to load users. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (conversationId) {
      socket.emit('joinConversation', conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    socket.emit('userOnline', currentUserId);

    const handleMessageReceive = (messageData) => {
      if (messageData.conversation === conversationId) {
        setMessages((prevMessages) => {
          // Prevent message duplication
          if (prevMessages.find((msg) => msg._id === messageData._id)) {
            return prevMessages;
          }
          return [...prevMessages, messageData];
        });
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (user) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'http://localhost:5001/api/chat/conversations',
        { participants: [currentUserId, user._id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversationId(response.data._id);

      const messagesResponse = await axios.get(
        `http://localhost:5001/api/chat/messages/${response.data._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(messagesResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setError('Failed to load messages. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    fetchMessages(user);
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
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage('');
        setShowEmojis(false);

        // Optimistically add the message to the chat before receiving it back from the server
        setMessages((prevMessages) => [...prevMessages, { ...messageData, _id: Date.now() }]);
      } catch (error) {
        console.error('Failed to send message:', error);
        setError('Failed to send message. Please try again.');
      }
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const getUserInitials = (name) => {
    const names = name.split(' ');
    return names.map((n) => n[0].toUpperCase()).join('');
  };

  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUserId &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#efeae2] overflow-hidden">
      {/* Left sidebar */}
      <div className="w-1/4 bg-white flex flex-col shadow-lg">
        {/* Search bar */}
        <div className="p-4 bg-[#f6f6f6]">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search or start new chat"
              className="pl-10 pr-4 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* User list */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                  selectedUser === user ? 'bg-[#ebebeb]' : ''
                }`}
                onClick={() => handleUserSelection(user)}
              >
                <Avatar
                  src={user.avatar || ''}
                  alt={user.name}
                  fallback={getUserInitials(user.name)}
                  className="w-12 h-12 mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage || ''}
                  </p>
                  {/* User status */}
                  <p className="text-xs text-gray-500">
                    {userStatuses[user._id] === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>

        {/* Logout button */}
        <Tooltip content="Log out of your account">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex items-center justify-center p-4 text-red-500 hover:bg-red-50 transition-colors duration-200 w-full"
          >
            <LogOut size={20} className="mr-2" />
            <span>Logout</span>
          </Button>
        </Tooltip>
      </div>

      {/* Main chat area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col bg-[#efeae2]">
          {/* Chat header */}
          <div className="bg-[#f0f2f5] px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <Avatar
                src={selectedUser.avatar || ''}
                alt={selectedUser.name}
                fallback={getUserInitials(selectedUser.name)}
                className="w-10 h-10 mr-4"
              />
              <h2 className="font-semibold text-lg">{selectedUser.name}</h2>
              <p className="text-xs text-gray-500">
                {userStatuses[selectedUser._id] === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Tooltip content="Start voice call">
                <Button variant="ghost" size="icon">
                  <Phone size={20} />
                </Button>
              </Tooltip>
              <Tooltip content="Start video call">
                <Button variant="ghost" size="icon">
                  <Video size={20} />
                </Button>
              </Tooltip>
              <Tooltip content="More options">
                <Button variant="ghost" size="icon">
                  <MoreVertical size={20} />
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* Messages area */}
          <ScrollArea className="flex-1 p-6" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-500">{error}</div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg._id}
                  className={`mb-4 ${
                    msg.sender === currentUserId ? 'flex justify-end' : 'flex justify-start'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[70%] ${
                      msg.sender === currentUserId
                        ? 'bg-[#dcf8c6] text-black'
                        : 'bg-white text-black'
                    }`}
                    style={{
                      opacity: 0,
                      animation: `fadeIn 0.3s ease-out forwards ${index * 0.1}s`,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Message input */}
          <form
            onSubmit={handleSendMessage}
            className="bg-white border-t border-gray-200 px-6 py-4 flex items-center"
          >
            <Tooltip content="Insert emoji">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setShowEmojis(!showEmojis)}
              >
                <Smile size={24} />
              </Button>
            </Tooltip>
            <Tooltip content="Attach file">
              <Button type="button" variant="ghost" size="icon" className="mr-2">
                <Paperclip size={24} />
              </Button>
            </Tooltip>
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" className="ml-4 bg-green-500 hover:bg-green-600">
              <Send size={20} />
            </Button>
          </form>

          {/* Emoji Picker */}
          {showEmojis && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
              <div className="flex flex-wrap">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="text-xl p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowEmojis(false)}
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#efeae2]">
          <p className="text-2xl text-gray-500">Select a user to start chatting</p>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
