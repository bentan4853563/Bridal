const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['User', 'Admin'], // You can add more roles if needed
      default: 'User',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'], // Possible statuses
      default: 'Active',
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
