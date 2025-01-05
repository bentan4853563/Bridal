const express = require('express');
const router = express.Router();
const Payment = require('../models/payment'); // Adjust the import according to your project structure

router.post('/create', async (req, res) => {
  try {
    // Input validation can be added here

    const newProduct = new Payment({
      ...req.body,
    });

    const savedProduct = await newProduct.save();

    // Respond with a 201 status code and the saved product
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating payment: ', error);

    // Respond with a 500 status code and an error message
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'customer',
      })
      .populate({
        path: 'order',
        populate: {
          path: 'details.product', // Populate the product field within order.details
        },
      });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch payments', error: error.message });
  }
});

router.get('/get-by-id/:id', async (req, res) => {
  try {
    const payments = await Payment.findById(req.params.id)
      .populate({
        path: 'customer',
      })
      .populate({
        path: 'order',
        populate: {
          path: 'details.product', // Populate the product field within order.details
        },
      });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch payments', error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.json(updatedPayment);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch payments', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    res.json(deletedPayment);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch payments', error: error.message });
  }
});

module.exports = router;
