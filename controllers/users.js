const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { currentError } = require('../utils/errors');
const BadReqError = require('../errors/bad_req_error');
const NotFoundError = require('../errors/not_found_error');
const EmailError = require('../errors/email_error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw currentError({ name: 'NotFoundError' });
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
            const err = new EmailError('Пользователь с таким email уже зарегистрирован');
            next(err);
          }
          if (e.name === 'ValidationError') {
            const err = new BadReqError('Переданы некорректные данные при создании профиля');
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
    .send({ message: 'Cookies удалены' });
  next();
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден')();
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadReqError('Переданы некорректные данные при обновлении профиля');
        next(err);
        return;
      }
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный _id пользователя');
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
