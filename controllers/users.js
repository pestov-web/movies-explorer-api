const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_JWT_SECRET } = require('../utils/config');

// user schema
const User = require('../models/user');

// errors
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UserExistsError = require('../errors/UserExistsError');
const AuthorizationError = require('../errors/AuthorizationError');

const {
  USER_NOT_FOUND_MSG,
  BAD_REQUEST_MSG,
  USER_EXISTS_MSG,
  AUTH_ERROR_MSG,
  LOG_OUT_MSG,
} = require('../utils/constants');

// получаем данные текущего пользователя
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(USER_NOT_FOUND_MSG))
    .then((user) => res.send(user))
    .catch(next);
};

// создаем пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })).catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new UserExistsError(USER_EXISTS_MSG);
      } else {
        next(err);
      }
    })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_MSG));
      } else {
        next(err);
      }
    });
};

// меняем данные пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError(USER_NOT_FOUND_MSG))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new UserExistsError(USER_EXISTS_MSG);
      } else {
        next(err);
      }
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_MSG));
      } else {
        next(err);
      }
    });
};

// при успешном логине помещаем токен в хттп куки
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send(
          {
            name: user.name,
            email: user.email,
          },
        );
    })
    .catch(() => {
      throw new AuthorizationError(AUTH_ERROR_MSG);
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  try {
    res.cookie('jwt', '', {
      maxAge: -1,
      httpOnly: true,
      sameSite: true,
    })
      .send({ message: `${LOG_OUT_MSG}` });
  } catch (err) {
    next(err);
  }
};
