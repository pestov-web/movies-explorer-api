const router = require('express').Router();

// мидлвэр авторизации
const auth = require('../middlewares/auth');

// подключаем роуты signin, signup, signout
router.use(require('./auth'));
// подключаем мидлвэр авторизации для роутов которые ниже
router.use(auth);
// подключаем роуты пользователей и фильмов
router.use(require('./users'));
router.use(require('./movies'));
// подключаем роут 404
router.use(require('./notFound'));

module.exports = router;
