const mongoose = require('mongoose');
const { Schema, Types } = mongoose; // Import Schema and Types

const PaymentSchema = new Schema(
  {
    customer: { type: Types.ObjectId, ref: 'Customer', required: true },
    order: { type: Types.ObjectId, ref: 'Order', required: true },
    date: { type: Date },
    amount: { type: Number },
    paymentType: {
      type: String,
      enum: ['Advance', 'Reservation', 'Guarantee', 'Refund'],
    },
    modality: {
      type: String,
      enum: ['Cash', 'Check', 'Transfer'],
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
