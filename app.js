const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const ERROR_CODE_NOT_FOUND = 404;

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });

app.use(bodyParser.json());
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64a7c5d92d5e4da6e6da813f',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res, next) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Страница не найдена' });
  next();
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен!');
});
