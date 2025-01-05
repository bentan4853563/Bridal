const express = require('express');
const multer = require('multer');
const router = express.Router();

const Product = require('../models/product');

const front_url = process.env.FRONT_URL

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('primaryPhoto'), async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      image: req.file ? req.file.path.replace('uploads', '') : null,
      rentalCostPerDay: req.body.rentalCostPerDay,
      category: req.body.category,
      subCategory: req.body.subCategory,
      quantity: req.body.quantity,
      status: req.body.status,
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    console.log('error :>> ', error);
  }
});

router.get('/list', async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;

    const customers = await Product.find().skip(skip).limit(limit).populate('category');

    const totalCustomers = await Product.countDocuments();
    const totalPages = Math.ceil(totalCustomers / limit);

    res.json({
      customers,
      currentPage: page,
      totalPages,
      totalCustomers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch customers', error: error.message });
  }
});

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

// Get a product by ID
router.get('/one', async (req, res) => {
  try {
    const product = await Product.findById(req.query.id)
      .populate('Category')

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

// // Update a product
// router.put('/update/:id', upload.single('primaryPhoto'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;

//     const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
//       new: true,
//     })

//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.json(updatedProduct);
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res
//       .status(400)
//       .json({ message: 'Failed to update customer', error: error.message });
//   }
// });

router.put(
  '/update/:id',
  upload.fields([
    { name: 'primaryPhoto', maxCount: 1 },
    { name: 'secondaryPhotos', maxCount: 10 },
    { name: 'videos', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      console.log('updatedData :>> ', updatedData);

      // Update primary photo if provided
      if (req.files.primaryPhoto && req.files.primaryPhoto.length > 0) {
        updatedData.image = req.files.primaryPhoto[0].path.replace(
          'uploads',
          ''
        );
      } else if (!updatedData.image) {
        // If no new primary photo and no existing image, keep it as is
        updatedData.image = updatedData.image || null; // or keep existing value
      }

      // Update secondary photos if provided
      if (req.files.secondaryPhotos && req.files.secondaryPhotos.length > 0) {
        const newSecondaryImages = req.files.secondaryPhotos.map((file) =>
          file.path.replace('uploads', '')
        );
        const existImages =
          updatedData.secondaryImages?.filter(
            (url) => !url.includes(front_url)
          ) || [];
        updatedData.secondaryImages = [...existImages, ...newSecondaryImages];
      } else {
        // If no new secondary photos, retain existing ones
        updatedData.secondaryImages = updatedData.secondaryImages || [];
      }

      // Update videos if provided
      if (req.files.videos && req.files.videos.length > 0) {
        const newVideoUrls = req.files.videos.map((file) =>
          file.path.replace('uploads', '')
        );
        const existVideos =
          updatedData.videoUrls?.filter((url) => url.includes(front_url)) || [];
        updatedData.videoUrls = [...existVideos, ...newVideoUrls];
      } else {
        // If no new videos, retain existing ones
        updatedData.videoUrls = updatedData.videoUrls || [];
      }

      // Update the product with the new data
      const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true, // Ensure validators are run for the update
      });

      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res
        .status(400)
        .json({ message: 'Failed to update product', error: error.message });
    }
  }
);


// Add stock
router.put(
  '/update/:id',
  upload.fields([
    { name: 'primaryPhoto', maxCount: 1 },
    { name: 'secondaryPhotos', maxCount: 10 },
    { name: 'videos', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      // Ensure videoUrls is an array
      if (typeof updatedData.videoUrls === 'string') {
        updatedData.videoUrls = [updatedData.videoUrls];
      }

      // Update primary photo if provided
      if (req.files.primaryPhoto && req.files.primaryPhoto.length > 0) {
        updatedData.image = req.files.primaryPhoto[0].path.replace(
          'uploads',
          ''
        );
      } else {
        updatedData.image = updatedData.image || null; // Retain existing value or set to null
      }

      // Update secondary photos if provided
      if (req.files.secondaryPhotos && req.files.secondaryPhotos.length > 0) {
        const newSecondaryImages = req.files.secondaryPhotos.map((file) =>
          file.path.replace('uploads', '')
        );
        const existImages =
          updatedData.secondaryImages?.filter(
            (url) => !url.includes(front_url)
          ) || [];
        updatedData.secondaryImages = [...existImages, ...newSecondaryImages];
      } else {
        updatedData.secondaryImages = updatedData.secondaryImages || [];
      }

      // Update videos if provided
      if (req.files.videos && req.files.videos.length > 0) {
        const newVideoUrls = req.files.videos.map((file) =>
          file.path.replace('uploads', '')
        );
        const existVideos =
          updatedData.videoUrls.filter((url) => url.includes(front_url)) || [];
        updatedData.videoUrls = [...existVideos, ...newVideoUrls];
      } else {
        updatedData.videoUrls = updatedData.videoUrls || [];
      }

      // Update the product with the new data
      const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true, // Ensure validators are run for the update
      });

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
