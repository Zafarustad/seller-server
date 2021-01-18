require('./Models/User');
require('./Models/Shop');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { signup, login, getAuthenticatedUser } = require('./Routes/AuthRoutes');
const { addShopDetails } = require('./Routes/ShopRoutes');
const { authToken } = require('./utils/AuthToken');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  bufferCommands: false,
  bufferMaxEntries: 0,
});

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('MongoDB database connection established succesfully');
});

connection.on('error', (err) => {
  console.log(`MongoDB error: ${err}`);
});

//User endpoints
app.post('/signup', signup);
app.post('/login', login);
app.get('/user/:id', authToken, getAuthenticatedUser);

//Shop endpoints
app.post('/shop', authToken, addShopDetails);

app.listen(port, () => {
  console.log(`server is listening to port: ${port}`);
});
