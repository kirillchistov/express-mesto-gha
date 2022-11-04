//  Общий роутер пока не подключаем  //
const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateUserCreate } = require('../middlewares/validate-user');
//  const NoDataError = require('../utils/errors/no-data-error');  //
const UnauthorizedError = require('../utils/errors/unauthorized-error');

router.post('/signin', validateLogin, login);
router.post('/signup', validateUserCreate, createUser);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('/signout', logout);
router.use((req, res, next) => {
  next(new UnauthorizedError('index 401: Для доступа требуется авторизация'));
});

module.exports = router;
