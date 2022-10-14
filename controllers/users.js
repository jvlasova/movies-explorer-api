const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadReqError = require('../errors/bad_req_error');
const NotFoundError = require('../errors/not_found_error');
const EmailError = require('../errors/email_error');
const {
  messageNotFoundError,
  messageEmailError,
  messageBadReqError,
  messageSignOut,
} = require('../utils/constant');

const { NODE_ENV, JWT_SECRET } = process.env;

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(messageNotFoundError);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        .then((user) => {
          const userInfo = user.toObject();
          delete userInfo.password;
          res.send(userInfo);
        })
        .catch((e) => {
          if (e.code === 11000) {
            const err = new EmailError(messageEmailError);
            next(err);
          }
          if (e.name === 'ValidationError') {
            const err = new BadReqError(messageBadReqError);
            next(err);
          } else {
            next(e);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ token });
    })
    .catch(next);
};

const signOut = (req, res, next) => {
  res.clearCookie('jwt', {
    sameSite: true,
  })
    .send({ message: messageSignOut });
  next();
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(messageNotFoundError);
      }
    })
    .catch((e) => {
      if (e.code === 11000) {
        const err = new EmailError(messageEmailError);
        next(err);
      }
      if (e.name === 'ValidationError') {
        const err = new BadReqError(messageBadReqError);
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports = {
  getMe,
  createUser,
  login,
  signOut,
  updateUserInfo,
};
