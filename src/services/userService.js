import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users';

// Obtenir la liste des utilisateurs
export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des utilisateurs');
  }
};
