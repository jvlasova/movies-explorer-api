const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth_error');
const { messageAuthError } = require('../utils/constant');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret');
  } catch (e) {
    const err = new AuthError(messageAuthError);
    next(err);
  }

  req.user = payload;
  next();
};

module.exports = auth;
