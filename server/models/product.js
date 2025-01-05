const mongoose = require('mongoose');
const { Schema, Types } = mongoose; 

// Define the schema for your model
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
    },
    image: {
      type: String, // URL or path to the primary photo
      required: true,
    },
    secondaryImages: [
      {
        type: String, // Array of URLs or paths for secondary photos
      },
    ],
    videoUrls: [{
      type: String, // Array of video URLs or paths
    }],
    rentalCostPerDay: {
      type: Number,
      required: true, // Rental cost is required
    },
    category: {
      type: Types.ObjectId,
      ref: 'Category',
    },
    subCategories: [
      {
        type: String,
      },
    ],
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model from the schema
const Product = mongoose.model('Product', ProductSchema);

// Export the model
module.exports = Product;
