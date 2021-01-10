const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('Users');

exports.authToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ error: 'Unauthorized' });
  }

  const token = authorization.split('Bearer ')[1];
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) {
      return res.status(404).send({ error: 'Bad token, login again' });
    }
    const { userId } = payload;
    const user = await User.findById(userId);
    req.user = user;
    return next();
  });
};
