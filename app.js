require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const error = require('./middlewares/error');
const rateLimiter = require('./middlewares/rateLimitter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  LEGAL_CORS, API_PORT, DEV_DB_URL,
} = require('./utils/config');

const { RUNNING_AT_PORT } = require('./utils/constants');

const { NODE_ENV, PROD_DB_URL, PORT = API_PORT } = process.env;

const app = express();

app.use('*', cors({
  origin: LEGAL_CORS,
  credentials: true,
}));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? PROD_DB_URL : DEV_DB_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(rateLimiter);

app.use(require('./routes/index'));

app.use(errorLogger);

// ошибки целебрейта
app.use(errors());

// собственный обработчик ошибок
app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${RUNNING_AT_PORT} ${PORT}`);
});
