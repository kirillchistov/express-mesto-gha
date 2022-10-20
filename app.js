//  Точка входа включает основную логику сервера, запуск и подключение к БД  //
//  Импортируем express, mongoose   //
const express = require('express');
const mongoose = require('mongoose');
//  Импортируем cors, bodyParser, пока не consoleLogger  //
const cors = require('cors');
const bodyParser = require('body-parser');
//  const { consoleLogger } = require('./middlewares/logger');  //
//  Импортируем express-rate-limit и helmet для безопасности  //
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
//  Импортируем роутеры  //
const users = require('./routes/users');
const cards = require('./routes/cards');
//  Импортируем константы с описаниями ошибок  //
const { NO_DATA_ERROR } = require('./utils/constants');
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

mongoose.connect('mongodb://localhost:27017/mestodb');

//  app.use(consoleLogger);  //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//  app.use(express.json());  //

//  Делаем временное решение авторизации  //
//  Вставляем id тестового пользователя  //
app.use((req, res, next) => {
  req.user = {
    _id: '634bafa09c56ed6016ec80c2',
  };
  next();
});

app.use(users);
app.use(cards);
app.use('*', (req, res) => {
  res.status(NO_DATA_ERROR).send({ message: 'Неправильный URL или метод' });
});

app.listen(PORT, () => {
  console.log(`App is live listening on port ${PORT}`);
});
