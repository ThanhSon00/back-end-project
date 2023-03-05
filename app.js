const express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var bodyParser = require('body-parser');
var session = require('express-session');

const accountRoutes = require('./routes/accountRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const checkLogged = require('./middleware/checkLogged');
const errorHandler = require('./middleware/errorHandler');
const asyncHandler = require('./middleware/asyncHandler');
const authorization = require('./middleware/authorization');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'pokemonvietnam2',
  resave: false,
  saveUninitialized: true,
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/log-in', checkLogged, async (req, res) => {
  const message = req.cookies.message;
  const messageType = req.cookies.messageType;
  res.clearCookie('message');
  res.clearCookie('messageType')
  res.render('log-in', {message: message, messageType: messageType});
});

app.use('/sign-in', checkLogged, async (req, res) => {
  const message = req.cookies.message;
  res.clearCookie('message')
  res.render('sign-in', {message: message});
})

app.use('/home', authorization ,async (req, res) => {
  const message = req.cookies.message;
  const messageType = req.cookies.messageType;
  res.clearCookie('message');
  res.clearCookie('messageType');
  res.render('index', {message: message, messageType: messageType});
});

app.use('/product', authorization, async (req, res) => {
  res.render('product');
});

app.use('/store', authorization, async (req, res) => {
  res.render('store');
});

app.use('/checkout', authorization, async (req, res) => {
  res.render('checkout');
});

app.use('/check-mail', async (req, res) => {
  res.render('check-mail');
})

app.use('/reset-password', async (req, res) => {
  const message = req.cookies.message;
  res.clearCookie('message')
  res.render('reset-password', {message: message});
})

app.use('/forgot-password', async (req, res) => {
  const message = req.cookies.message;
  res.clearCookie('message')
  res.render('forgot-password', {message: message});
})

// api
app.use('/api/v1/account', asyncHandler(accountRoutes));
app.use('/api/v1/customer', asyncHandler(customerRoutes));
app.use('/api/v1/cart', asyncHandler(cartRoutes));
app.use('/api/v1/product', asyncHandler(productRoutes));
app.use('/api/v1/invoice', asyncHandler(invoiceRoutes));

// Create Error 404 when not found path
app.use(function (req, res, next) {
  next(createError(404));
});

// Middleware
app.use(errorHandler);

module.exports = app;
