// models/Customer.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    whatsApp: { type: String, required: true },
    date: { type: String, required: true }, // Consider using Date type if applicable
    location: { type: String, required: true },
    type: { type: String, enum: ['client', 'prospect'], default: 'client' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', CustomerSchema);
