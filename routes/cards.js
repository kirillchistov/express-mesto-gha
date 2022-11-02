//  Реализуйте роуты для карточек  //
//  GET /cards — возвращает все карточки  //
//  POST /cards — создаёт карточку  //
//  DELETE /cards/:cardId — удаляет карточку по id  //
//  PUT /cards/:cardId/likes — добавляет лайк карточке по id  //
//  DELETE /cards/:cardId/likes — удаляет лайк у карточки по id  //

const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

//  выносим валидацию карточек в middleware  //
//  const { celebrate, Joi } = require('celebrate');  //
//  const regex = require('../utils/regex');  //

const { validateCard, validateCardId } = require('../middlewares/validate-card');

router.get('/', getCards);

router.post('/', validateCard, createCard);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, likeCard);

router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
