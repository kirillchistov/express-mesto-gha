const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const handleErrors = require('./utils/handleErrors');

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
app.use('/', router);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
//  console.log(`App is live listening on port ${PORT}`);  //
});
