const Movie = require('../models/movie');
const BadReqError = require('../errors/bad_req_error');
const NotFoundError = require('../errors/not_found_error');
const NoAuthError = require('../errors/no_auth_error');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const owner = req.user._id;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    });
    res.send(movie);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BadReqError('Переданы некорректные данные при создании фильма');
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
      throw new NotFoundError('Фильм по указанному _id не найден.');
    } if (movie.owner.toString() !== owner) {
      throw new NoAuthError('У Вас нет прав на удаление фильма.');
    }
    await Movie.findByIdAndRemove(req.params.movieId);
    res.send({ message: 'Фильм удален.' });
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BadReqError('Передан некорректный _id фильма.');
      next(err);
    } else {
      next(e);
    }
  }
};
