const express = require('express');
const multer = require('multer');
const router = express.Router();

const Product = require('../models/product');

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

    console.log('newProduct :>> ', newProduct);

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

    const customers = await Product.find().skip(skip).limit(limit);

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
      .populate('SubCategory');

      console.log('product :>> ', product);
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

// Update a product
router.put('/update/:id', upload.single('primaryPhoto'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    })

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res
      .status(400)
      .json({ message: 'Failed to update customer', error: error.message });
  }
});

// Add stock
router.put('/add-stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    let product = await Product.findById(id);

    if (!product) {
      res.status(400).json({ message: 'Not found product' });
    }

    product.quantity += quantity;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.log('error :>> ', error);
    res
      .status(400)
      .json({ message: 'Failed to add stock', error: error.message });
  }
});

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
