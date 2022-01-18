const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// получаем все фильмы пользователя
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

// удаляем фильм по ид
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError('Фильма с таким id не существует'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new UnauthorizedError('Недостаточно прав для удаления Фильма');
      }
      Movie.findByIdAndRemove(req.params._id)
        .orFail(new NotFoundError('Фильма с таким id не существует'))
        .then((deletedMovie) => res.send(deletedMovie))
        .catch(next);
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
        next(new BadRequestError(`Переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};
