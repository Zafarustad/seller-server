const mongoose = require('mongoose');

const Shop = mongoose.model('Shops');
const Seller = mongoose.model('Sellers');

exports.getAllShops = async (req, res) => {
  try {
    const doc = await Shop.find({});
    // console.log('doc', doc);
    return res.status(200).send(doc);
  } catch (err) {
    return res.status(500).send({ error: `Internal server error: ${err}` });
  }
};

exports.getShopOwnerData = async (req, res) => {
  try {
    const doc = await Seller.findOne(
      {
        _id: req.params.sellerId,
      },
      { password: 0, __v: 0 }
    );
    if (!doc) {
      return res.status(400).send({ general: 'Seller not found' });
    }
    return res.status(200).send(doc);
  } catch (err) {
    res.status(500).send({ error: `internal server error: ${err}` });
  }
};
