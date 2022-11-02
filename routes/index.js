//  Общий роутер пока не подключаем  //
const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateUserCreate } = require('../middlewares/validate-user');
//  const NoDataError = require('../utils/errors/no-data-error');  //

router.post('/signin', validateLogin, login);
router.post('/signup', validateUserCreate, createUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardsRouter);

/*
router.use('*', (req, res, next) => {
  next(new NoDataError('По этому адресу ничего не найдено'));
});
*/

module.exports = router;
