//  Три роута GET /cards, POST /cards, DELETE /cards/:cardId  //
//  В теле POST-запроса JSON-объект с полями: name и link  //

const Card = require('../models/card');
const { handleErrors, handleIdErrors } = require('../utils/constants');

//  Получаем все карточки и получаем к ним данные создателя  //
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ cards }))
    .catch((err) => handleErrors(err, res));
};

//  Функция в App.js добавляет в каждый запрос объект user  //
//  Берем из него идентификатор пользователя в контроллере создания карточки  //
//  Захардкодили id пользователя, в базе у новой карточки пока один и тот же автор  //

//  Контроллер создания карточки - передаем name, link   //
module.exports.createCard = (req, res) => {
//  console.log(req.user._id);  //
  const creatorId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: creatorId })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleErrors(err, res));
};

//  Контроллер удаления карточки - передаем cardId, запускаем поиск  //
//  Если нет карточки с таким id, обрабатываем ошибку handleIdErrors   //
//  Остальные ошибки обрабатываем по умолчанию handleErrors  //
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => handleIdErrors(card, res))
    .catch((err) => {
      handleErrors(err, res);
    });
};

//  Контроллер добавления лайка карточке - передаем cardId, запускаем поиск  //
//  Если в лайках нет карточки с таким id, добавляем _id в массив с new: true  //
//  Если нет карточки с таким id, обрабатываем ошибку handleIdErrors   //
//  Остальные ошибки обрабатываем по умолчанию handleErrors  //
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => handleIdErrors(card, res))
    .catch((err) => handleErrors(err, res));
};

//  Контроллер удаления лайка карточки - передаем cardId, запускаем поиск  //
//  Если у карточки с таким id лайков нет, удаляем _id из массива  //
//  Если нет карточки с таким id, обрабатываем ошибку handleIdErrors   //
//  Остальные ошибки обрабатываем по умолчанию handleErrors  //
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => handleIdErrors(card, res))
    .catch((err) => {
      handleErrors(err, res);
    });
};
