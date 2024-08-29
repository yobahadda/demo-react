import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Conversations from './pages/Conversations';
import Chat from './pages/Chat'; // Assure-toi que ce chemin est correct

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
