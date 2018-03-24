var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var assert = require('assert');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var reqSet = require('../index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware init
app.use(reqSet.middleware);

// Assertions
app.use((req, res, next) => {
  // object api
  req.set({
    'foo': 1,
    'Bar': 2
  });

  // string api
  req.set('baz', 100);

  // object api
  req.set('object', { complex: true });

  assert.equal(req.get('foo'), 1);
  assert.equal(req.get('Foo'), 1);

  assert.equal(req.get('bar'), 2);
  assert.equal(req.get('Bar'), 2);

  assert.equal(req.get('baz'), 100);
  assert.equal(req.get('Baz'), 100);

  assert.equal(req.get('object'), '{"complex":true}');

  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
