const auth = require('express').Router();

const { validateLogin, validateUser } = require('../middlewares/validate');
const { login, createUser, logout } = require('../controllers/users');

auth.post('/signin', validateLogin, login);
auth.post('/signup', validateUser, createUser);
auth.post('/signout', logout);

module.exports = auth;
