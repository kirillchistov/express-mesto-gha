const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
//  const { consoleLogger } = require('./middlewares/logger');  //
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
//  Импортируем все роутеры  //
const router = require('./routes');
//  const users = require('./routes/users');  //
//  const cards = require('./routes/cards');  //
//  Импортируем константы с описаниями ошибок  //
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { URL_REGEXP, PASSWORD_PATTERN } = require('./utils/constants');
//  Нужно приделать еще логирование ошибок, чтобы удобней было разбираться  //
const { ErrorCodes } = require('./utils/errors/error-codes');
//  const MONGO_DB_URL = require('mongodb://localhost:27017/mestodb');  //
const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb', { autoindex: true });

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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(PASSWORD_PATTERN).required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEXP),
    email: Joi.string().required().email(),
    password: Joi.string().pattern(PASSWORD_PATTERN).required().min(8),
  }),
}), createUser);

app.use('/', auth, router);

app.use('*', (req, res, next) => {
  next(new ErrorCodes.NO_DATA_ERROR(`По адресу ${req.baseUrl} ничего не нашлось`));
});

app.listen(PORT, () => {
//  console.log(`App is live listening on port ${PORT}`);  //
});
