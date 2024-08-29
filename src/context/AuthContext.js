import React, { createContext, useState, useContext } from 'react';
import { login, register } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = async (email, password) => {
    try {
      const data = await login(email, password); // Appel à votre fonction de connexion
      if (data && data.user) { // Vérifie si les données utilisateur existent
        setUser(data.user); // Sauvegarde les informations de l'utilisateur dans le contexte
        localStorage.setItem('token', data.token); // Sauvegarde le token dans localStorage
        localStorage.setItem('userId', data.user._id); // Sauvegarde l'ID utilisateur dans localStorage
        
        console.log('User logged in:', data.user);
  
      } else {
        throw new Error('Invalid login response'); // Erreur si les données de connexion ne sont pas valides
      }
    } catch (error) {
      console.error('Erreur de connexion', error.message); // Affiche l'erreur
      throw error; // Rejette l'erreur pour qu'elle puisse être traitée dans le composant Login
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
