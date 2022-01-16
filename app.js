require('dotenv').config();

const express = require('express');
// const mongoose = require('mongoose');

const { errors } = require('celebrate');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();

// ошибки целебрейта
app.use(errors());

// собственный обработчик ошибок
app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порту: ${PORT}`);
});
