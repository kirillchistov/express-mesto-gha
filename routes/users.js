//  Реализуйте роуты для пользователей  //
//  GET /users — возвращает всех пользователей  //
//  POST /users — создаёт пользователя  //
//  GET /users/:userId - возвращает пользователя по _id  //
//  PATCH /users/me - обновляет данные профиля  //
//  PATCH /users/me/avatar - обновляет аватар профиля  //

const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:userId', getUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
