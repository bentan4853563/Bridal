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

router.put('/update/:id', async (req, res) => {
  try {
    console.log('req.body :>> ', req.body);
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error creating customer:', error);
    res
      .status(400)
      .json({ message: 'Failed to create customer', error: error.message });
  }
});

router.put('/add-subcategory/:id', async (req, res) => {
  try {
    const { subCategory } = req.body;
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Category.findById(categoryId);

    // Check if the category exists
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if the subcategory already exists
    if (category.subCategories.includes(subCategory)) {
      return res.status(400).json({ message: 'Subcategory must be unique' });
    }

    // Add the new subcategory
    category.subCategories.push(subCategory);

    // Save the updated category
    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error adding subcategory:', error);
    res
      .status(400)
      .json({ message: 'Failed to add subcategory', error: error.message });
  }
});


// update subcategory
router.put('/update-subcategory/:id', async (req, res) => {
  try {
    const { oldname, newname } = req.body;
    const category = await Category.findById(req.params.id); // Use req.params.id

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          subCategories: category.subCategories?.map((item) =>
            item === oldname ? newname : item
          ),
        },
      },
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res
      .status(400)
      .json({ message: 'Failed to update subcategory', error: error.message });
  }
});

// delete subcategory
router.put('/delete-subcategory/:id', async (req, res) => {
  try {
    const { subCategory } = req.body;
    const category = await Category.findById(req.params.id); // Use req.params.id

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { subCategories: subCategory },
      },
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res
      .status(400)
      .json({ message: 'Failed to delete subcategory', error: error.message });
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
