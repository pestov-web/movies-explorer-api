const movies = require('express').Router();
const { validateId } = require('../middlewares/validate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
movies.get('/', getMovies);
// создаёт фильм
movies.post('/', createMovie);
// удаляет сохранённый фильм по id
movies.delete('/:_id', validateId, deleteMovie);

module.exports = movies;
