const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  ShopDescription: {
    type: String,
  },
  shopCategory: {
    type: String,
  },
  shopInventory: {
    type: Array,
  },
  shopAddress: {
    type: String,
    required: true,
  },
  shopPincode: {
    type: Number,
    required: true,
  },
  shopOwnerId: {
    type: String,
    required: true,
  },
  shopReviews: {
    type: Array,
  },
  Gstin: {
    type: Number,
    required: true,
    unique: true,
  },
  // shopMenuImage: {
  // type: String,
  // },
  // shopImage: {
  // type: String,
  // },
});

mongoose.model('Shops', ShopSchema);
