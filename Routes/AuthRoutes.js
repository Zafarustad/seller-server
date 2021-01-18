const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { signupValidator, loginValidator } = require('../utils/validators');
const { ObjectId } = require('mongodb');

//using model we created
const User = mongoose.model('Users');

//signup api
exports.signup = (req, res) => {
  const { email, password, shopOwnerName, number } = req.body;

  const newUser = {
    email,
    password,
    shopOwnerName,
    number,
  };

  const { errors, valid } = signupValidator(newUser);
  if (!valid) {
    return res.status(400).send(errors);
  }

  const user = new User(newUser);
  user
    .save()
    .then(() => {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
      return res.status(200).send({ token });
    })
    .catch((err) => {
      return res.status(500).send({ error: `${err.message}` });
    });
};

//login api
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const credentials = { email, password };

  const { valid, errors } = loginValidator(credentials);
  if (!valid) {
    return res.status(400).send(errors);
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ general: 'Wrong email or password' });
  }
  bcrypt
    .compare(password, user.password)
    .then((result) => {
      if (!result) {
        return res.status(400).send({ general: 'Wrong email or password' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
      return res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(500).send({ error: `internal server error: ${err}` });
    });
};

//get authenticated user details api
exports.getAuthenticatedUser = (req, res) => {
  User.findOne(
    {
      _id: req.params.id,
    },
    { _id: 1, email: 1, shopOwnerName: 1 }
  )
    .then((doc) => {
      if (!doc) {
        return res.status(400).send({ general: 'User not found' });
      }
      res.status(200).send(doc);
    })
    .catch((err) => {
      res.status(500).send({ error: `internal server error: ${err}` });
    });
};
