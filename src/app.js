const express = require('express');
const path = require('path');
const router = require('./routes/router');
const userRouter = require('./routes/user');
require('./db/mongoose');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(userRouter);
app.use(router);


module.exports = app;
