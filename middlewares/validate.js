const { celebrate, Joi, CelebrateError } = require('celebrate');
const isURL = require('validator/lib/isURL');
const { WRONG_URL_MSG } = require('../utils/constants');

// проверяем ссылку на валидность
const validateUrl = (url) => {
  if (!isURL(url)) {
    throw new CelebrateError(WRONG_URL_MSG);
  }
  return url;
};

// проверяем данные пользователя
const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// проверяем ид
const validateId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
});

// проверяем данные при обновлении информации пользователя
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// проверяем данные при входе пользователя
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// проверяем данные при создании фильма
const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1).max(20),
    director: Joi.string().required().min(1).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(1).max(4500),
    image: Joi.string().required().custom(validateUrl),
    trailer: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(1).max(30),
    nameEN: Joi.string().required().min(1).max(30),
  }),
});

module.exports = {
  validateUser,
  validateId,
  validateUserUpdate,
  validateLogin,
  validateMovie,
};
