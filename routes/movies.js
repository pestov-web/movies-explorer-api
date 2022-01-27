const movies = require('express').Router();
const { validateId, validateMovie } = require('../middlewares/validate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
movies.get('/movies/', getMovies);
// создаёт фильм
movies.post('/movies/', validateMovie, createMovie);
// удаляет сохранённый фильм по id
movies.delete('/movies/:movieId', validateId, deleteMovie);

module.exports = movies;
