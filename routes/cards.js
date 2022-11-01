//  Реализуйте роуты для карточек  //
//  GET /cards — возвращает все карточки  //
//  POST /cards — создаёт карточку  //
//  DELETE /cards/:cardId — удаляет карточку по id  //
//  PUT /cards/:cardId/likes — добавляет лайк карточке по id  //
//  DELETE /cards/:cardId/likes — удаляет лайк у карточки по id  //

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { URL_REGEXP, CARD_ID_PATTERN } = require('../utils/constants');

//  router.get('/', getCards);
router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEXP),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(CARD_ID_PATTERN).length(24),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(CARD_ID_PATTERN).length(24),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(CARD_ID_PATTERN).length(24),
  }),
}), dislikeCard);

module.exports = router;
