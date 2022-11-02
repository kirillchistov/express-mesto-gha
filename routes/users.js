//  Реализуйте роуты для пользователей  //
//  GET /users — возвращает всех пользователей  //
//  POST /users — создаёт пользователя  //
//  GET /users/:userId - возвращает пользователя по _id  //
//  PATCH /users/me - обновляет данные профиля  //
//  PATCH /users/me/avatar - обновляет аватар профиля  //

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
//  createUser пока не делаем  //
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const regex = require('../utils/regex');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

//  createUser пока не делаем  //
//  router.post('/users', createUser);  //

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex),
  }),
}), updateAvatar);

module.exports = router;
