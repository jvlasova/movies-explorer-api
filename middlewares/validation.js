const { ObjectId } = require('mongoose').Types;
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Введите корректную ссылку');
  }
  return value;
};

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(300),
    director: Joi.string().required().min(2).max(300),
    duration: Joi.number().required().min(2),
    year: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    image: Joi.string().custom(urlValidation).required(),
    trailerLink: Joi.string().custom(urlValidation).required(),
    thumbnail: Joi.string().custom(urlValidation).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(300),
    nameEN: Joi.string().required().min(2).max(300),
  }),
});

const validateAnyId = (valua, helpes) => {
  if (!ObjectId.isValid(valua)) {
    return helpes.error('any.invalid');
  }
  return valua;
};

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom(validateAnyId),
  }),
});

module.exports = {
  validateLogin,
  validateUser,
  validateUserUpdate,
  validateMovie,
  validateMovieId,
};
