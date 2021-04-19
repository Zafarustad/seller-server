const mongoose = require('mongoose');

const Shop = mongoose.model('Shops');
const Seller = mongoose.model('Sellers');

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

  const shop = new Shop(newShop);

  shop
    .save()
    .then((shopDoc) => {
      Seller.findOneAndUpdate(
        { _id: shopOwnerId },
        { $set: { detailsCompleted: 1 } },
        { returnOriginal: false, projection: { password: 0, __v: 0 } }
      )
        .then((doc) => {
          let result = {
            message: 'Details updated successfully!',
            userData: { ...doc._doc },
            shopData: { ...shopDoc._doc },
          };
          return result;
        })
        .then((result) => {
          return res.status(200).send(result);
        })
        .catch((err) => {
          return res.status(500).send({ error: `Server error ${err.message}` });
        });
    })
    .catch((err) => {
      return res.status(500).send({ error: `Server error ${err.message}` });
    });
};

exports.addShopCoordinates = (req, res) => {
  const { latititude, longitude, shopId, shopOwnerId } = req.body;

  const coordinates = {
    latititude,
    longitude,
  };

  Shop.findOneAndUpdate(
    { _id: shopId },
    { $set: { shopCoordinate: coordinates } },
    { returnOriginal: false, projection: { __v: 0 } }
  )
    .then((shopDoc) => {
      Seller.findOneAndUpdate(
        { _id: shopOwnerId },
        { $set: { detailsCompleted: 2 } },
        { returnOriginal: false, projection: { password: 0, __v: 0 } }
      )
        .then((doc) => {
          let result = {
            message: 'Details updated successfully!',
            userData: { ...doc._doc },
            shopData: { ...shopDoc._doc },
          };
          return result;
        })
        .then((result) => {
          return res.status(200).send(result);
        })
        .catch((err) => {
          return res
            .status(500)
            .send({ error: `Internal server error: ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).send({ error: `Internal server error: ${err}` });
    });
};

exports.getShopDetails = (req, res) => {
  Shop.findOne({
    _id: req.params.shopId,
  })
    .then((doc) => {
      if (!doc) {
        return res.status(400).send({ general: 'Shop not found' });
      }
      res.status(200).send(doc);
    })
    .catch((err) => {
      res.status(500).send({ error: `internal server error: ${err}` });
    });
};

exports.addToInventory = (req, res) => {
  const { productName, stockQuantity, price, shopId } = req.body;
  const data = {
    productName,
    stockQuantity,
    price,
    _id: new mongoose.Types.ObjectId(),
    inStock: true,
    createdAt: new Date(),
  };

  Shop.findOneAndUpdate(
    { _id: shopId },
    { $push: { inventory: data } },
    { returnOriginal: false, projection: { __v: 0 } }
  )
    .then((doc) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({ error: `internal server error: ${err}` });
    });
};

exports.deleteInventoryProduct = async (req, res) => {
  try {
    await Shop.findOneAndUpdate(
      { _id: req.params.shopId },
      {
        $pull: {
          inventory: { _id: mongoose.Types.ObjectId(req.params.productId) },
        },
      }
    );
    return res.status(200).send({ general: 'Product Deleted Successfully!' });
  } catch (err) {
    res.status(500).send({ error: `internal server error: ${err}` });
  }
};

exports.getShopInventory = async (req, res) => {
  try {
    const doc = await Shop.find({ _id: req.params.shopId }).sort({
      createdAt: 1,
    });
    if (doc) {
      return res.status(200).send(doc[0].inventory);
    }
  } catch (err) {
    res.status(500).send({ error: `internal server error: ${err}` });
  }
};
