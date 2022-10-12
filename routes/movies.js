const express = require('express');

const movies = express.Router();
const { validateMovie, validateMovieId } = require('../validation/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movies.get('/', express.json(), getMovies);
movies.post('/', express.json(), validateMovie, createMovie);
movies.delete('/:movieId', express.json(), validateMovieId, deleteMovie);

module.exports = movies;
