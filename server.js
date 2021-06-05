require('./Seller/Models/Seller');
require('./Seller/Models/Shop');
require('./Seller/Models/Order');
require('./Admin/Model/Admin');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {
  signup,
  login,
  getAuthenticatedUser,
} = require('./Seller/Routes/AuthRoutes');
const {
  addShopDetails,
  addShopCoordinates,
  getShopDetails,
  addToInventory,
  deleteInventoryProduct,
  getShopInventory,
  updateShopDetails,
  updateShopImage,
  changeProductAvailability,
} = require('./Seller/Routes/ShopRoutes');
const {
  addNewOrder,
  getCompletedShopOrders,
  getPendingShopOrders,
  markOrderComplete,
  markOrderCancelled,
} = require('./Seller/Routes/OrderRoutes');
const { adminLogin, adminSignup } = require('./Admin/Routes/AdminAuthRoutes');
const {
  getAllShops,
  getShopOwnerData,
  markShopVerified,
  markShopUnverified,
} = require('./Admin/Routes/AdminShopRoutes');
const { authToken } = require('./utils/AuthToken');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

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

//Admin auth endpoints
app.post('/admin/signup', adminSignup);
app.post('/admin/login', adminLogin);
app.get('/admin/shops', authToken, getAllShops);
app.get('/admin/seller/:sellerId', authToken, getShopOwnerData);
app.put('/admin/verify/:shopId', authToken, markShopVerified);
app.put('/admin/unverify/:shopId', authToken, markShopUnverified);

//seller auth endpoints
app.post('/seller/signup', signup);
app.post('/seller/login', login);
app.get('/seller/user/:id', authToken, getAuthenticatedUser);

//Seller Shop endpoints
app.post('/seller/shop', authToken, addShopDetails);
app.post('/seller/shop/coordinate', authToken, addShopCoordinates);
app.get('/seller/shop/:shopId', authToken, getShopDetails);
app.post('/seller/shop/product', authToken, addToInventory);
app.get('/seller/inventory/:shopId', authToken, getShopInventory);
app.put('/seller/shop', authToken, updateShopDetails);
app.put('/seller/shopImage', authToken, updateShopImage);
app.put('/seller/inventory/availability', authToken, changeProductAvailability);
app.delete(
  '/seller/shop/:shopId/product/:productId',
  authToken,
  deleteInventoryProduct
);

//Seller Order endpoints
app.post('/seller/order', authToken, addNewOrder);
app.get('/seller/order/pending/:shopId', authToken, getPendingShopOrders);
app.get('/seller/order/completed/:shopId', authToken, getCompletedShopOrders);
app.put('/seller/order/complete/:orderId', authToken, markOrderComplete);
app.put('/seller/order/cancelled/:orderId', authToken, markOrderCancelled);

module.exports = app