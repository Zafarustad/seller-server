const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    items: {
      type: Array,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    cancelled: {
      type: Boolean,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    customerDetails: {
      type: Object,
      required: true,
    },
    shopId: {
      type: String,
      required: true,
    },
    paid: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model('Orders', OrderSchema);
