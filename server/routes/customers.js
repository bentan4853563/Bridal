const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Customer = require('../models/customer');
const router = express.Router();

// Create a new customer
router.post('/create', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json({
      message: 'Customer created successfully',
      customer: savedCustomer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res
      .status(400)
      .json({ message: 'Failed to create customer', error: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;

    const customers = await Customer.find().skip(skip).limit(limit);

    const totalCustomers = await Customer.countDocuments();
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

// Get a customer by ID
router.get('/one', async (req, res) => {
  try {
    const customer = await Customer.findById(req.query.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch customer', error: error.message });
  }
});

// Update a customer
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({
      message: 'Customer updated successfully',
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res
      .status(400)
      .json({ message: 'Failed to update customer', error: error.message });
  }
});

// Delete a customer
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({
      message: 'Customer deleted successfully',
      customer: deletedCustomer,
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res
      .status(500)
      .json({ message: 'Failed to delete customer', error: error.message });
  }
});

module.exports = router;
