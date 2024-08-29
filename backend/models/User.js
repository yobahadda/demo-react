
// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String }, // Optional field for user avatars
  lastMessage: { type: String } // Optional field for last message preview
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
