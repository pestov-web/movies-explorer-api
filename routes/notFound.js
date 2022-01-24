const notFound = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');
const { URL_NOT_FOUND_MSG } = require('../utils/constants');

notFound.use((req, res, next) => {
  next(new NotFoundError(URL_NOT_FOUND_MSG));
});

module.exports = notFound;
