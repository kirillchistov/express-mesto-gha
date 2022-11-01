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
const { URL_REGEXP } = require('../utils/constants');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().pattern(/[a-f0-9]/).length(24),
  }),
}), getUser);

//  createUser пока не делаем  //
//  router.post('/users', createUser);  //

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEXP),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEXP),
  }),
}), updateAvatar);

module.exports = router;
