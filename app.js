//  Точка входа  //
//  Импортируем express, mongoose и console (для дебаггинга)   //
const express = require('express');
const mongoose = require('mongoose');
const console = require('console');

//  Задаем порт и адрес подключения к Mongo  //
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());

//  Делаем временное решение авторизации  //
//  Вставляем id тестового пользователя  //
app.use((req, res, next) => {
  req.user = {
    _id: '634bafa09c56ed6016ec80c2',
  };
  next();
});

mongoose.connect(MONGO_URL);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  const err = new Error('Некорректный адрес или метод запроса');
  return res.status(404).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App successfully started and is listening to port ${PORT}`);
});
