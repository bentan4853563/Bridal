const mongoose = require('mongoose');
const { Schema, Types } = mongoose; // Import Schema and Types

const OrderSchema = new Schema(
  {
    customer: { type: Types.ObjectId, ref: 'customers', required: true }, // Ensure it's an ObjectId
    detail: [{
        product: { type: Types.ObjectId, ref: 'products', required: true }, // Ensure it's an ObjectId
        amount: { type: Number, required: true },
    }],
    reservationDate: { type: Date },
    returnDate: { type: Date },
    paymentStatus: { type: String },
    status: {
      type: String,
      enum: ['Draft', 'Reserved', 'Picked up', 'Returned'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
