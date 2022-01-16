const movies = require('express').Router();
const { validateMovie, validateId } = require('../middlewares/validate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
movies.get('/', getMovies);
// создаёт фильм
movies.post('/', validateMovie, createMovie);
// удаляет сохранённый фильм по id
movies.delete('/movieId', validateId, deleteMovie);

module.exports = movies;
