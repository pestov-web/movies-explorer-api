const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  MOVIE_NOT_FOUND_MSG,
  DELETE_MOVIE_MESSAGE,
  BAD_REQUEST_MSG,
} = require('../utils/constants');

// получаем все фильмы пользователя
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

// удаляем фильм по ид
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(MOVIE_NOT_FOUND_MSG))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new UnauthorizedError(DELETE_MOVIE_MESSAGE);
      } else {
        Movie.deleteOne(movie)
          .then(() => res.send({ message: movie }))
          .catch(next);
      }
    })
    .catch(next);
};

// Создаем новый фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_MSG));
      } else {
        next(err);
      }
    });
};
