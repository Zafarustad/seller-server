const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
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
//   image: {
//     type: Buffer,
//     required: true,
//   },
});

mongoose.model('Products', ProductSchema);
