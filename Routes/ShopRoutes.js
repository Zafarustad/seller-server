const mongoose = require('mongoose');
const { shopDetailsValidator } = require('../utils/validators');

const Shop = mongoose.model('Shops');

exports.addShopDetails = (req, res) => {
  const {
    shopOwnerId,
    shopName,
    category,
    address,
    city,
    pincode,
    gstin,
  } = req.body;

  const newShop = {
    shopOwnerId,
    shopName,
    category,
    address,
    city,
    pincode,
    gstin,
  };

  const { valid, errors } = shopDetailsValidator(newShop);
  if (!valid) {
    return res.status(400).send(errors);
  }

  const shop = new Shop(newShop);

  shop
    .save()
    .then(() => {
      return res
        .status(200)
        .send({ message: 'Shop details registered successfully!' });
    })
    .catch((err) => {
      return res.status(500).send({ error: `Server error ${err.message}` });
    });
};
