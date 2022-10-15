const Movie = require('../models/movie');
const BadReqError = require('../errors/bad_req_error');
const NotFoundError = require('../errors/not_found_error');
const NoAuthError = require('../errors/no_auth_error');
const {
  messageNotFoundError,
  messageBadReqError,
  messageNoAuthError,
  messageFilmDelete,
} = require('../utils/constant');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    res.send(movie);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BadReqError(messageBadReqError);
      next(err);
    } else {
      next(e);
    }
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      throw new NotFoundError(messageNotFoundError);
    } if (movie.owner.toString() !== owner) {
      throw new NoAuthError(messageNoAuthError);
    }
    await Movie.findByIdAndRemove(req.params.movieId);
    res.send({ message: messageFilmDelete });
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BadReqError(messageBadReqError);
      next(err);
    } else {
      next(e);
    }
  }
};
