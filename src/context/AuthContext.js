import React, { createContext, useState, useContext } from 'react';
import { login, register } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = async (email, password) => {
    try {
      const data = await login(email, password);
      setUser(data.user); // Sauvegarde les infos de l'utilisateur
      localStorage.setItem('token', data.token); // Sauvegarde le token
    } catch (error) {
      console.error('Erreur de connexion', error);
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      await register(name, email, password);
      await loginUser(email, password);
    } catch (error) {
      console.error('Erreur d\'inscription', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
