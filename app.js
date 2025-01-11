const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const usersRoute = require('./routes/users');
const customerRoute = require('./routes/customers');
const productRoute = require('./routes/product');
const reservationRoute = require('./routes/reservation');
const categoryRoute = require('./routes/category');
const paymentRoute = require('./routes/payment');

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.DB_URI, {
    directConnection: true,
  })
  .then(
    () => {
      console.log('Connected to mongoDB');
    },
    (err) => console.log('Error connecting to mongoDB', err)
  );

mongoose.set('debug', true);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.use('/api/users', usersRoute);
app.use('/api/customers', customerRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/products', productRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/category', categoryRoute);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json('Server is running correctly!');
});

// Serve static files from the uploads directory
app.use('/', express.static(path.join(__dirname, 'uploads')));

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };
