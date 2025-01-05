const express = require('express');
require('dotenv').config();
const router = express.Router();

const SubCategory = require('../models/subCategory');

router.get('/all', async (req, res) => {
  try {
    const categories = await SubCategory.find();
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
    const newCategory = new SubCategory({ name: req.body.subcategory });

    const addedSubCategory = await newCategory.save();

    res.json(addedSubCategory);
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
    const deletedCategory = await SubCategory.findByIdAndDelete(req.params.id);

    res.json(deletedCategory);
  } catch (error) {
    console.error('Error creating customer:', error);
    res
      .status(400)
      .json({ message: 'Failed to create customer', error: error.message });
  }
});

module.exports = router