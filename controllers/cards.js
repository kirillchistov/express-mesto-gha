//  Три роута GET /cards, POST /cards, DELETE /cards/:cardId  //
//  В теле POST-запроса JSON-объект с полями: name и link  //

const Card = require('../models/card');
//  const { handleErrors, handleIdErrors } = require('../utils/handleErrors');  //
const { ErrorCodes } = require('../utils/errors/error-codes');

//  Получаем все карточки   //
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(ErrorCodes.OK).send({ data: cards });
  } catch (err) {
    next(err);
  }
};

//  Функция в App.js добавляет в каждый запрос объект user  //
//  Берем из него идентификатор пользователя в контроллере создания карточки  //

//  Контроллер создания карточки - передаем name, link, owner: creatorId   //
module.exports.createCard = async (req, res, next) => {
  try {
    const creatorId = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: creatorId });
    res.status(ErrorCodes.OK).send({ data: card });
  } catch (err) {
    next(err);
  }
};

//  Контроллер удаления карточки - передаем cardId, запускаем поиск  //
//  Если нет карточки с таким id, обрабатываем ошибку экземпляром класса 404   //
module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      next(new ErrorCodes.NO_DATA_ERROR(`Карточка с id ${req.params.cardId} не найдена`));
      return;
    } if (card.owner.toHexString() !== req.user._id) {
      next(new ErrorCodes.FORBIDDEN_ERROR('Карточку другого пользователя удалить нельзя'));
      return;
    }
    await card.delete();
    res.status(ErrorCodes.OK).send({ message: `Карточка с id ${req.params.cardId} удалена` });
  } catch (err) {
    next(err);
  }
};

//  Контроллер добавления лайка карточке - передаем cardId, запускаем поиск  //
//  Если в лайках нет карточки с таким id, добавляем _id в массив с new: true  //
//  Если нет карточки с таким id, обрабатываем ошибку экземпляром класса 404   //
module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(new ErrorCodes.NO_DATA_ERROR(`Карточка с id ${req.params.cardId} не найдена`));
      return;
    }
    res.status(ErrorCodes.OK).send({ message: 'Лайк добавлен' });
  } catch (err) {
    next(err);
  }
};

//  Контроллер удаления лайка карточки - передаем cardId, запускаем поиск  //
//  Добавляем пользователя в массив, если его там ещё нет $addToSet //
//  Убираем из массива с помощью $pull  //
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
      next(new ErrorCodes.NO_DATA_ERROR(`Карточка с id ${req.params.cardId} не найдена`));
      return;
    }
    res.status(ErrorCodes.OK).send({ message: 'Лайк удален' });
  } catch (err) {
    next(err);
  }
};
