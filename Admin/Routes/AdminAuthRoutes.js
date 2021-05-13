const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = mongoose.model('AdminUser');

exports.adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const newAdmin = { email, password };
    let finalDoc = {};

    const user = new Admin(newAdmin);
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: '30d',
    });
    const doc = await Admin.findOne({ email }, { password: 0, __v: 0 });
    if (!doc) {
      return res.status(400).send({ general: 'Admin user not found' });
    }
    finalDoc = { token, ...doc._doc };
    return res.status(200).send(finalDoc);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ error: 'Admin account already exists!' });
    } else {
      return res.status(500).send({ error: `Internal server error: ${err}` });
    }
  }
};

//admin login api
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).send({ general: 'Wrong email or password' });
    }
    let finalDoc = {};
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(400).send({ general: 'Wrong email or password' });
    }
    let token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: '30d',
    });
    finalDoc = { token, adminData: { _id: user._id, email: user.email } };
    return res.status(200).send(finalDoc);
  } catch (err) {
    return res.status(500).send({ error: `Internal server error: ${err}` });
  }
};
