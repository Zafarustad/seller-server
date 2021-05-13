const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema(
  {
    shopOwnerId: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    inventory: {
      type: Array,
    },
    shopReviews: {
      type: Array,
    },
    shopCoordinate: {
      type: Object,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    upiId: {
      type: String,
    },
    shopImage: {
    type: String,
    },
    // shopMenuImage: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

mongoose.model('Shops', ShopSchema);
