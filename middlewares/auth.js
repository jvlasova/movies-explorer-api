const jwt = require('jsonwebtoken');
const { currentError } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret');
  } catch (e) {
    next(currentError({ name: 'AuthError' }));
  }

  req.user = payload;
  next();
};

module.exports = auth;
