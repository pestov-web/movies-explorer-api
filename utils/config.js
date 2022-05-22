const DEV_DB_URL = 'mongodb://127.0.0.1:27017/moviesdb';
const API_PORT = 3000;
const DEV_JWT_SECRET = 'dev-secret';
const LEGAL_CORS = [
  'http://127.0.0.1:3000',
  'https://api1.pestov-web.ru',
  'https://movies.pestov-web.ru',
  'http://localhost:3000',
];

module.exports = {
  DEV_DB_URL, API_PORT, LEGAL_CORS, DEV_JWT_SECRET,
};
