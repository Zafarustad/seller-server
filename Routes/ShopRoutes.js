const mongoose = require('mongoose');

const Shop = mongoose.model('Shops');

exports.addShopDetails = (req, res) => {
  const {
    shopOwnerId,
    shopName,
    ShopDescription,
    shopCategory,
    shopInventory,
    shopAddress,
    shopPincode,
  } = req.body;

  const newShop = {
    shopOwnerId,
    shopName,
    ShopDescription,
    shopCategory,
    shopInventory,
    shopAddress,
    shopPincode,
  };

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
