import React, { createContext, useState, useContext } from 'react';
import { login, register } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = async (email, password) => {
    try {
      const data = await login(email, password);
      if (data && data.user) { // Check if user data exists
        setUser(data.user); // Save user info
        localStorage.setItem('token', data.token); // Save token
      } else {
        throw new Error('Invalid login response'); // This will be caught and handled
      }
    } catch (error) {
      console.error('Erreur de connexion', error.message);
      throw error; // Rethrow the error to handle it in the Login component
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
