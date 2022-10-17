//  3 роута: GET /users, GET /users/:userId, POST /users  //
//  В теле POST-запроса передайте JSON-объект с полями: name, about и avatar  //

const User = require('../models/user');
const { handleErrors, handleIdErrors } = require('../utils/handleErrors');

//  Получаем всех пользователей  //
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleErrors(err, res));
};

//  Контроллер создания пользователя - передаем name, about, avatar  //
//  В случае ошибки запускаем дефолтный обработчик  //
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErrors(err, res);
    });
};

//  Контроллер получения конкретного юзера  - ищем по userId  //
//  Если нет юзера с таким id, обрабатываем ошибку handleIdErrors   //
//  Остальные ошибки обрабатываем по умолчанию handleErrors  //
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      handleIdErrors(user, res);
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

//  Контроллер обновления профиля юзера  - ищем по userId  //
module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleErrors(err, res));
};

//  Контроллер обновления аватара юзера  - ищем по userId  //
module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => handleErrors(err, res));
};
