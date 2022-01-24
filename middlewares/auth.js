const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { NOT_AUTH_ERROR_MSG } = require('../utils/constants');
const { DEV_JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new AuthorizationError(NOT_AUTH_ERROR_MSG);
  }
  const token = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET}`);
  } catch (err) {
    throw new AuthorizationError(NOT_AUTH_ERROR_MSG);
  }
  req.user = payload;

  next();
};
