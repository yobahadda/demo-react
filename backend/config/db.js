const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb://localhost:27017/aya'; // Nom de la base de données
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
