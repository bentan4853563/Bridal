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
    const categoryData = new Category(req.body);
    const newCategory = await categoryData.save();
    console.log('newCategory :>> ', newCategory);
    res.json(newCategory);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(400).json({
      message: 'Failed to create customer',
      error: error.message,
    });
  }
});

router.post('/subcategory/add', async (req, res) => {
  try {
    const { name, parentId } = req.body;

    // Find the parent category
    const category = await Category.findById(parentId);
    if (!category) {
      return res.status(404).json({ message: 'Parent category not found' });
    }

    // Update the parent category's subCategories array
    const updatedCategory = await Category.findByIdAndUpdate(
      parentId,
      { $push: { subCategories: name } }, // Use $push to add the new subcategory
      { new: true } // Return the updated document
    );

    console.log('updatedCategory :>> ', updatedCategory);
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(400).json({
      message: 'Failed to create subcategory',
      error: error.message,
    });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
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
