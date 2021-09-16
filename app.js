var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var homeRouter = require('./routes/index');
var userRouter = require('./routes/user');
var userApi = require('./viewApis/user');

const PORT = process.env.PORT || 8080;

var app = express();
app.use(cookieParser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/userApi', userApi);

module.exports = app;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});
