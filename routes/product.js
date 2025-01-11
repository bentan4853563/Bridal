const express = require('express');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();

const Product = require('../models/product');

const front_url = process.env.FRONT_URL;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Create a Product
// First save files and save file links to Database
router.post(
  '/create',
  upload.fields([
    { name: 'newPrimaryPhoto' },
    { name: 'newSecondPhotos' },
    { name: 'newVideos' },
  ]),
  async (req, res) => {
    try {
      // Extract form data
      const {
        name,
        rentalCost,
        buyCost,
        category,
        subCategory,
        quantity,
        status,
      } = req.body;

      // Prepare file paths
      const primaryPhoto = req.files['newPrimaryPhoto'][0].path.replace(
        'uploads',
        ''
      ); // Path to the primary photo
      const secondaryImages = req.files['newSecondPhotos']
        ? req.files['newSecondPhotos'].map((file) =>
            file.path.replace('uploads', '')
          )
        : []; // Array of secondary image paths
      const videoUrls = req.files['newVideos']
        ? req.files['newVideos'].map((file) => file.path.replace('uploads', ''))
        : []; // Array of video paths

      // Create a new product instance
      const newProduct = new Product({
        name,
        rentalCost,
        buyCost,
        category,
        subCategory,
        quantity,
        status,
        primaryPhoto,
        secondaryImages,
        videoUrls,
      });

      // Save the product to the database
      await newProduct.save();

      // Respond with success
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }
);

// Read All Products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get a Product by ID
router.get('/one', async (req, res) => {
  try {
    const product = await Product.findById(req.query.id).populate('Category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch customer', error: error.message });
  }
});

// Update a Product
router.put(
  '/update/:id',
  upload.fields([
    { name: 'newPrimaryPhoto' },
    { name: 'newSecondPhotos' },
    { name: 'newVideos' },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      // Update primary photo if provided
      if (req.files.newPrimaryPhoto && req.files.newPrimaryPhoto.length > 0) {
        updatedData.primaryPhoto = req.files.newPrimaryPhoto[0].path.replace(
          'uploads',
          ''
        );
      } else if (!updatedData.primaryPhoto) {
        // If no new primary photo and no existing image, keep it as is
        updatedData.primaryPhoto = updatedData.primaryPhoto || null; // or keep existing value
      }

      // Ensure secondaryImages is an array
      updatedData.secondaryImages = Array.isArray(updatedData.secondaryImages)
        ? updatedData.secondaryImages
        : [];

      // Update secondary images if provided
      if (req.files.newSecondPhotos && req.files.newSecondPhotos.length > 0) {
        const newSecondaryImages = req.files.newSecondPhotos?.map((file) =>
          file.path.replace('uploads', '')
        );
        const existingImages =
          updatedData.secondaryImages?.filter(
            (url) => !url.includes(front_url)
          ) || [];
        updatedData.secondaryImages = [
          ...existingImages,
          ...newSecondaryImages,
        ];
      } else {
        // If no new secondary images, retain existing ones
        updatedData.secondaryImages = updatedData.secondaryImages || [];
      }

      // Ensure secondaryImages is an array
      updatedData.videoUrls = Array.isArray(updatedData.videoUrls)
        ? updatedData.videoUrls
        : [];
      // Update video URLs if provided
      if (req.files.newVideos && req.files.newVideos.length > 0) {
        const newVideoUrls = req.files.newVideos?.map((file) =>
          file.path.replace('uploads', '')
        );
        const existingVideos =
          updatedData.videoUrls?.filter((url) => url.includes(front_url)) || [];
        updatedData.videoUrls = [...existingVideos, ...newVideoUrls];
      } else {
        // If no new videos, retain existing ones
        updatedData.videoUrls = updatedData.videoUrls || [];
      }

      // Update the product with the new data
      const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true, // Ensure validators are run for the update
      });
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res
        .status(400)
        .json({ message: 'Failed to update product', error: error.message });
    }
  }
);

// Delete a product
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res
      .status(500)
      .json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
