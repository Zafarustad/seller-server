const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  CustomerDetails: {
    type: Object,
    required: true,
  },
  orderFromShop: {
    type: Object,
    required: true,
  },
});

mongoose.model('Orders', OrderSchema);
