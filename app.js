const express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var bodyParser = require('body-parser');

const accountRoutes = require('./routes/accountRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const authRoutes = require('./routes/authRoutes');
const activateRoutes = require('./routes/activateRoutes');
const signInRoutes = require('./routes/signInRoutes');
const logoutRoutes = require('./routes/logoutRoutes');

const errorHandler = require('./middleware/errorHandler');
const asyncHandler = require('./middleware/asyncHandler');
const authorization = require('./middleware/authorization');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/log-in', async (req, res) => {
  res.render('logIn');
});

app.use('/sign-in', async (req, res) => {
  res.render('signIn');
})

app.use('/home', authorization ,async (req, res) => {
  res.render('index');
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

app.use('/activation', asyncHandler(activateRoutes));

app.use('/auth', asyncHandler(authRoutes));

app.use('/sign-in-controller', asyncHandler(signInRoutes));
app.use('/log-out-controller', asyncHandler(logoutRoutes));
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
