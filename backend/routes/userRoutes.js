const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route pour obtenir tous les utilisateurs sauf l'utilisateur connecté
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await User.find({ _id: { $ne: userId } }); // Trouver tous les utilisateurs sauf celui connecté
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

module.exports = router;
