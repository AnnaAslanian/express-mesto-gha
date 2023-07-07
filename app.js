const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { family: 4 });

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
