const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const AuthorizationError = require('../errors/AuthorizationError');
const { AUTH_ERROR_MSG, WRONG_EMAIL_MSG } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: WRONG_EMAIL_MSG,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError(AUTH_ERROR_MSG);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError(AUTH_ERROR_MSG);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
