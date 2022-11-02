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
const regex = require('../utils/regex');

//  router.get('/cards', getCards);
router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regex),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
