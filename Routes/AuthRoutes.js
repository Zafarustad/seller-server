const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Seller = mongoose.model('Sellers');
const Shop = mongoose.model('Shops');

//signup api
exports.signup = (req, res) => {
  const { email, password, shopOwnerName, mobileNumber } = req.body;

  const newUser = {
    email,
    password,
    shopOwnerName,
    mobileNumber,
    detailsCompleted: 0,
  };

  let finalDoc = {};

  const user = new Seller(newUser);
  user
    .save()
    .then(() => {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
      // return res.status(200).send({ token });
      finalDoc.token = token;
    })
    .then(() => {
      Seller.findOne(
        {
          email,
        },
        { password: 0, __v: 0 }
      )
        .then((doc) => {
          if (!doc) {
            return res.status(400).send({ general: 'Seller not found' });
          }
          finalDoc = { ...finalDoc, ...doc._doc };
          return res.status(200).send(finalDoc);
        })
        .catch((err) => {
          res.status(500).send({ error: `Internal server error: ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).send({ error: `Internal server error: ${err}` });
    });
};

//login api
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const credentials = { email, password };

  const user = await Seller.findOne({ email });
  if (!user) {
    return res.status(400).send({ general: 'Wrong email or password' });
  }
  let finalDoc = {};
  bcrypt
    .compare(password, user.password)
    .then((result) => {
      if (!result) {
        return res.status(400).send({ general: 'Wrong email or password' });
      }
      let token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
      finalDoc.token = token;
    })
    .then(() => {
      Seller.findOne(
        {
          email,
        },
        { password: 0, __v: 0 }
      )
        .then((doc) => {
          if (!doc) {
            return res.status(400).send({ general: 'Seller not found' });
          }
          finalDoc = { ...finalDoc, userData: { ...doc._doc } };
          return doc;
        })
        .then((userDoc) => {
          Shop.findOne({ shopOwnerId: userDoc._doc._id })
            .then((shopDoc) => {
              if (!shopDoc) {
                return res.status(200).send(finalDoc);
              }
              finalDoc = { ...finalDoc, shopData: { ...shopDoc._doc } };
              return res.status(200).send(finalDoc);
            })
            .catch((err) => {
              res.status(500).send({ error: `Internal server error: ${err}` });
            });
        })
        .catch((err) => {
          res.status(500).send({ error: `Internal server error: ${err}` });
        });
    })
    .catch((err) => {
      res.status(500).send({ error: `Internal server error: ${err}` });
    });
};

//get authenticated user details api
exports.getAuthenticatedUser = (req, res) => {
  Seller.findOne(
    {
      _id: req.params.id,
    },
    { _id: 1, email: 1, shopOwnerName: 1 }
  )
    .then((doc) => {
      if (!doc) {
        return res.status(400).send({ general: 'Seller not found' });
      }
       return res.status(200).send(doc);
    })
    .catch((err) => {
      res.status(500).send({ error: `internal server error: ${err}` });
    });
};
