const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order'); // Assuming you have an Order model defined
const Product = require('../models/product'); // Assuming you have a Product model defined
const Customer = require('../models/customer'); // Assuming you have a Customer model defined

// Create a new order
router.post('/reserve', async (req, res) => {
  try {
    const {
      customer,
      details,
      reserveDate,
      returnDate,
      paymentStatus,
      status,
    } = req.body;

    // Create a new order instance
    const newOrder = new Order({
      customer,
      details,
      reserveDate,
      returnDate,
      paymentStatus,
      status,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res
      .status(500)
      .json({ message: 'Failed to create order', error: error.message });
  }
});

// Get a list of orders with pagination
router.get('/list', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .populate('customer')
      .populate('details.product')
      .exec();

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get a list of orders with pagination
router.post('/list-by-customer', async (req, res) => {
  try {
    const id = req.body.id;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch orders based on customer ID
    const orders = await Order.find({ customer: id })
      .populate('customer')
      .populate('details.product')
      .exec();

    // Corrected line to count total orders
    const totalOrders = await Order.countDocuments({ customer: id }); // Pass an object here
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.post('/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.body.id);
    const updatedOrder = await Order.findByIdAndUpdate(
      req.body.id,
      {
        paymentStatus: !order.paymentStatus,
      },
      { new: true }
    )
      .populate('customer')
      .populate('details.product');

    res.json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Get a single order by ID
router.get('/one/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const order = await Order.findById(req.params.id)
      .populate('customer')
      .populate('details.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Update an order
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res
      .status(400)
      .json({ message: 'Failed to update order', error: error.message });
  }
});

// Delete an order
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res
      .status(500)
      .json({ message: 'Failed to delete order', error: error.message });
  }
});

module.exports = router;
