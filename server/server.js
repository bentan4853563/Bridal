const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path')

const { getSecret } = require('./secrets');
const usersRoute = require('./routes/users');
const customerRoute = require('./routes/customers')
const productRoute = require('./routes/product');
const orderRoute = require('./routes/orders');

mongoose.Promise = global.Promise;
mongoose.connect(getSecret('dbUri')).then(
  () => {
    console.log('Connected to mongoDB');
  },
  (err) => console.log('Error connecting to mongoDB', err)
);
mongoose.set('debug', true);


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'uploads')))

app.use('/api/users', usersRoute);
app.use('/api/customers', customerRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };
