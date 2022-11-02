const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
//  const { consoleLogger } = require('./middlewares/logger');  //
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
//  const { celebrate, Joi } = require('celebrate');  //
//  Импортируем все роутеры  //
const router = require('./routes');
//  const users = require('./routes/users');  //
//  const cards = require('./routes/cards');  //
//  Импортируем константы с описаниями ошибок  //
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
//  const regex = require('./utils/regex');  //
//  Нужно приделать еще логирование ошибок, чтобы удобней было разбираться  //
// const { ErrorCodes } = require('./utils/errors/error-codes');  //
const NoDataError = require('./utils/errors/no-data-error');

//  const MONGO_DB_URL = require('mongodb://localhost:27017/mestodb');  //
const {
  PORT = 3000,
  MONGO_DB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());

mongoose.connect(MONGO_DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//  Удаляем временное решение авторизации  //
//  Вставляем id тестового пользователя  //
/* app.use((req, res, next) => {
  req.user = {
    _id: '634bafa09c56ed6016ec80c2',
  };
  next();
});
*/

app.post('/signin', login);
app.post('/signup', createUser);

/* app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().regex(regexEmail).required().email(),
    password: Joi.string().regex(regexPass).required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexUrl),
    email: Joi.string().required().email(),
    password: Joi.string().regex(regexPass).required().min(8),
  }),
}), createUser);
*/

//  app.use('/', auth, router);  //
app.use('/', router);

/*
app.use('*', (req, res, next) => {
  next(new NoDataError(`По адресу ${req.baseUrl} ничего не нашлось`));
});
*/

app.listen(PORT, () => {
//  console.log(`App is live listening on port ${PORT}`);  //
});
