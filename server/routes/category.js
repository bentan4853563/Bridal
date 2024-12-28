const express = require('express');
require('dotenv').config();
const router = express.Router();

const Category = require('../models/category');

router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error creating customer:', error);
    res
      .status(400)
      .json({ message: 'Failed to create customer', error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    console.log(req.body);
    const newCategory = new Category({ name: req.body.category });

    const newCat = await newCategory.save();

    res.json(newCat);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(400).json({
      message: 'Failed to create customer',
      error: error.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    console.log('req.params.id :>> ', req.params.id);
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    res.json(deletedCategory);
  } catch (error) {
    console.error('Error creating customer:', error);
    res
      .status(400)
      .json({ message: 'Failed to create customer', error: error.message });
  }
});

module.exports = router;
