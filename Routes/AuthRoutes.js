const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { signupValidator, loginValidator } = require('../utils/validators');

//using model we created
const User = mongoose.model('Users');

//signup api
exports.signup = (req, res) => {
  const { email, password, shopOwnerName } = req.body;

  const newUser = {
    email,
    password,
    shopOwnerName,
  };

  const { errors, valid } = signupValidator(newUser);
  if (!valid) {
    return res.status(403).send(errors);
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
    return res.status(403).send(errors);
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ general: 'Wrong email or password' });
  }
  bcrypt
    .compare(password, user.password)
    .then((result) => {
      if (!result) {
        return res.status(403).send({ general: 'Wrong email or password' });
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
  let credentails = {
    email: req.user.email,
    username: req.user.username,
  };

  res.status(200).send(credentails);
};
