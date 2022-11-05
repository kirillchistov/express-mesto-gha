const Card = require('../models/card');
const ForbiddenError = require('../utils/errors/forbidden-error');
const NoDataError = require('../utils/errors/no-data-error');
const IncorrectDataError = require('../utils/errors/incorrect-data-error');

//  Получаем все карточки   //
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const creatorId = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: creatorId });
    res.send({ data: card });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NoDataError(`Карточка с id ${req.params.cardId} не найдена`);
      } else if (card.owner.toHexString() !== req.user._id) {
        throw new ForbiddenError('Карточку другого пользователя удалить нельзя');
      }
      return card.delete()
        .then(() => {
          res.status(200).send({ data: card });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError(`400: переданы некорректные данные для удаления карточки с id ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

//  Если нет карточки с таким id, обрабатываем ошибку экземпляром класса 404   //
module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(new NoDataError(`Карточка с id ${req.params.cardId} не найдена`));
      return;
    }
    res.send({ message: 'Лайк добавлен' });
  } catch (err) {
    next(err);
  }
};

//  Если у карточки с таким id лайков нет, удаляем _id из массива  //
//  Если нет карточки с таким id, обрабатываем ошибку (экземпляр класса 404)   //
module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      next(new NoDataError(`Карточка с id ${req.params.cardId} не найдена`));
      return;
    }
    res.send({ message: 'Лайк удален' });
  } catch (err) {
    next(err);
  }
};
