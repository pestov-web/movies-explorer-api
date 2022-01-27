const users = require('express').Router();
const { validateUserUpdate } = require('../middlewares/validate');

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
users.get('/users/me', getCurrentUser);
// обновляет информацию о пользователе (email и имя)
users.patch('/users/me', validateUserUpdate, updateUser);

module.exports = users;
