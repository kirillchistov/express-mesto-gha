//  Точка входа включает основную логику сервера, запуск и подключение к БД  //
//  Импортируем express, mongoose и console (для дебаггинга)   //
const express = require('express');
const mongoose = require('mongoose');
//  Импортируем bodyParser для совместимости  //
const bodyParser = require('body-parser');
//  Импортируем модуль CORS для поддержки кросс-доменности  //
const cors = require('cors');
//  Импортируем роутеры  //
const users = require('./routes/users');
const cards = require('./routes/cards');
//  Импортируем константы с описаниями ошибок  //
const { NO_DATA_ERROR } = require('./utils/constants');
//  const MONGO_DB_URL = require('mongodb://localhost:27017/mestodb');  //

const { PORT = 3000 } = process.env;

const app = express();

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
  res.status(NO_DATA_ERROR).send({ message: 'Неправильный URL или метод запроса' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App is live and is listening to port ${PORT}`);
});
