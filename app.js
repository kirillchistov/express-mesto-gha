const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//  bodyParser заменили на встроенный express.json  //
//  const bodyParser = require('body-parser');  //
//  logger и dotenv (для хранения ключа) пока не используем  //
//  const { consoleLogger } = require('./middlewares/logger');  //
//  const dotenv = require('dotenv').config();  //
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
//  Импортируем все роутеры  //
const router = require('./routes');
//  const users = require('./routes/users');  //
//  const cards = require('./routes/cards');  //
//  Импортируем константы с описаниями ошибок  //
const auth = require('./middlewares/auth');
const { login, createUser, logout } = require('./controllers/users');
const handleErrors = require('./utils/handleErrors');
//  const regex = require('./utils/regex');  //
//  Нужно приделать еще логирование ошибок, чтобы удобней было разбираться  //
// const { ErrorCodes } = require('./utils/errors/error-codes');  //
//  const NoDataError = require('./utils/errors/no-data-error');  //
//  const UnauthorizedError = require('./utils/errors/unauthorized-error');  //
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

app.use(express.json());
app.use(cookieParser());
app.use(cors());

//  Удаляем временное решение авторизации  //
//  _id: '634bafa09c56ed6016ec80c2'  //

app.use('/', router);
//  app.use('/', router);  //
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
//  console.log(`App is live listening on port ${PORT}`);  //
});
