const mongoose = require('mongoose');
const { Schema, Types } = mongoose; // Import Schema and Types

const OrderSchema = new Schema(
  {
    customer: { type: Types.ObjectId, ref: 'Customer', required: true }, // Ensure it's an ObjectId
    details: [
      {
        product: { type: Types.ObjectId, ref: 'Product' }, // Ensure it's an ObjectId
        amount: { type: Number },
      },
    ],
    reserveDate: { type: Date },
    returnDate: { type: Date },
    paymentStatus: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Draft', 'Reserved', 'Picked up', 'Returned'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
