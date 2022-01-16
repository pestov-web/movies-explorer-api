const Card = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// получаем все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// удаляем фильм по ид
module.exports.deleteMovie = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail(new NotFoundError('Карточки с таким id не существует'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedError('Недостаточно прав для удаления карточки');
      }
      Card.findByIdAndRemove(req.params._id)
        .orFail(new NotFoundError('Карточки с таким id не существует'))
        .then((deletedCard) => res.send(deletedCard))
        .catch(next);
    })
    .catch(next);
};

// Создаем новый фильм
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
