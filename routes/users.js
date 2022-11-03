//  Реализуйте роуты для пользователей  //
//  GET /users — возвращает всех пользователей  //
//  POST /users — создаёт пользователя  //
//  GET /users/:userId - возвращает пользователя по _id  //
//  PATCH /users/me - обновляет данные профиля  //
//  PATCH /users/me/avatar - обновляет аватар профиля  //

const router = require('express').Router();

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

//  createUser пока не делаем  //
//  router.post('/users', createUser);  //

//  выносим валидацию юзеров в middleware  //
//  const regex = require('../utils/regex');
//  const { celebrate, Joi } = require('celebrate');  //

const { validateUserId, validateProfileUpdate, validateAvatar } = require('../middlewares/validate-user');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateProfileUpdate, updateProfile);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
