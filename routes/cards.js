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

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
