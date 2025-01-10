require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config()

const usersRoute = require('./routes/users');
const customerRoute = require('./routes/customers');
const productRoute = require('./routes/product');
const reservationRoute = require('./routes/reservation');
const categoryRoute = require('./routes/category');
const paymentRoute = require('./routes/payment');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI).then(
  () => {
    console.log('Connected to mongoDB');
  },
  (err) => console.log('Error connecting to mongoDB', err)
);
mongoose.set('debug', true);

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('combined'));
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'app.thebridalhouse.ma',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'dist'))); // Serve your frontend build

app.use('/api/users', usersRoute);
app.use('/api/customers', customerRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/products', productRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/category', categoryRoute);

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
