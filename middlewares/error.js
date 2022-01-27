// обработчик ошибок
const { SERVER_ERROR_MSG } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: `${SERVER_ERROR_MSG} ${err.message}` });

  next();
};
