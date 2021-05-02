require('./Models/Seller');
require('./Models/Shop');
require('./Models/Order');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { signup, login, getAuthenticatedUser } = require('./Routes/AuthRoutes');
const {
  addShopDetails,
  addShopCoordinates,
  getShopDetails,
  addToInventory,
  deleteInventoryProduct,
  getShopInventory,
  markShopVerified,
  updateShopDetails,
  updateShopImage,
  changeProductAvailability,
} = require('./Routes/ShopRoutes');
const {
  addNewOrder,
  getCompletedShopOrders,
  getPendingShopOrders,
  markOrderComplete,
  markOrderCancelled,
} = require('./Routes/OrderRoutes');
const { authToken } = require('./utils/AuthToken');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  // bufferCommands: false,
  bufferMaxEntries: 0,
});

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('MongoDB database connection established succesfully');
});

connection.on('error', (err) => {
  console.log(`MongoDB error: ${err}`);
});

app.get('/aws-test', (req, res) => {
  res.status(200).send('aws-test hello-world');
});

//seller auth endpoints
app.post('/seller/signup', signup);
app.post('/seller/login', login);
app.get('/seller/user/:id', authToken, getAuthenticatedUser);

//Shop endpoints
app.post('/seller/shop', authToken, addShopDetails);
app.post('/seller/shop/coordinate', authToken, addShopCoordinates);
app.get('/seller/shop/:shopId', authToken, getShopDetails);
app.post('/seller/shop/product', authToken, addToInventory);
app.get('/seller/inventory/:shopId', authToken, getShopInventory);
app.put('/seller/verify/:shopId', authToken, markShopVerified);
app.put('/seller/shop', authToken, updateShopDetails);
app.put('/seller/shopImage', authToken, updateShopImage);
app.put(
  '/seller/inventory/availability',
  authToken,
  changeProductAvailability
);
app.delete(
  '/seller/shop/:shopId/product/:productId',
  authToken,
  deleteInventoryProduct
);

//Order endpoints
app.post('/seller/order', authToken, addNewOrder);
app.get('/seller/order/pending/:shopId', authToken, getPendingShopOrders);
app.get('/seller/order/completed/:shopId', authToken, getCompletedShopOrders);
app.put('/seller/order/complete/:orderId', authToken, markOrderComplete);
app.put('/seller/order/cancelled/:orderId', authToken, markOrderCancelled);

app.listen(port, () => {
  console.log(`server is listening to port: ${port}`);
});
