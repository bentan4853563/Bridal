const mongoose = require('mongoose');
const { Schema, Types } = mongoose; // Import Schema and Types

const PaymentSchema = new Schema(
  {
    client: { type: Types.ObjectId, ref: 'Customer', required: true },
    reservation: { type: Types.ObjectId, ref: 'Reservation', required: true },
    paymentDate: { type: Date },
    amount: { type: Number },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Credit Card', 'Check'],
    },
    paymentType: {
      type: String,
      enum: ['Advance', 'Reservation', 'Guarantee', 'Refund'],
    },
    reference: {
      type: String,
    },
    note: {
      type: String,
    },
    attachments: [
      {
        name: {
          type: String,
        },
        size: {
          type: Number,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
