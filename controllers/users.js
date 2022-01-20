const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;

// user schema
const User = require('../models/user');

// errors
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UserExistsError = require('../errors/UserExistsError');
const AuthorizationError = require('../errors/AuthorizationError');

// получаем данные текущего пользователя
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователя не существует'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
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
        throw new UserExistsError('Пользователь с таким email уже зарегистрирован');
      }
      next(err);
    })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
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
    .orFail(new NotFoundError('Пользователя не существует'))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new UserExistsError('Пользователь с таким email уже зарегистрирован');
      }
      next(err);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

// при успешном логине помещаем токен в хттп куки
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
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
      throw new AuthorizationError('Введен неверный логин или пароль');
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
      .send({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};
