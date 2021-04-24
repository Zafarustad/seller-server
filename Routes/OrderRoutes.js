const mongoose = require('mongoose');

const Order = mongoose.model('Orders');

exports.addNewOrder = (req, res) => {
  const { items, customerDetails, shopId } = req.body;

  let totalAmount = items.reduce((acc, val) => {
    return acc + val.MRP;
  }, 0);

  const newOrder = {
    items,
    totalAmount,
    customerDetails,
    shopId,
    active: true,
    cancelled: false,
    paid: false,
  };

  const order = new Order(newOrder);
  order
    .save()
    .then((doc) => {
      return res.status(200).send(doc._doc);
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ err: `Internal server error: ${err.message}` });
    });
};

exports.getPendingShopOrders = (req, res) => {
  Order.find({ shopId: req.params.shopId, active: true })
    .sort({ createdAt: -1 })
    .then((doc) => {
      res.status(200).send(doc);
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ err: `Internal server error: ${err.message}` });
    });
};

exports.getCompletedShopOrders = (req, res) => {
  Order.find({ shopId: req.params.shopId, active: false })
    .sort({ createdAt: -1 })
    .then((doc) => {
      res.status(200).send(doc);
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ err: `Internal server error: ${err.message}` });
    });
};

exports.markOrderComplete = (req, res) => {
  Order.findOneAndUpdate(
    { _id: req.params.orderId },
    { $set: { active: false } },
    { returnOriginal: false }
  )
    .then((doc) => {
      return res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `internal server error: ${err}` });
    });
};

exports.markOrderCancelled = (req, res) => {
  Order.findOneAndUpdate(
    { _id: req.params.orderId },
    { $set: { active: false, cancelled: true } },
    { returnOriginal: false }
  )
    .then((doc) => {
      return res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `internal server error: ${err}` });
    });
};
