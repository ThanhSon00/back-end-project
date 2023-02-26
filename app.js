const express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');

const accountRoutes = require('./routes/accountRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const errorHandler = require('./middleware/errorHandler');
const asyncHandler = require('./middleware/asyncHandler');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', async (req, res) => {
  res.render('login');
});

app.use('/home', async (req, res) => {
  res.render('index');
});

app.use('/product', async (req, res) => {
  res.render('product');
});

app.use('/store', async (req, res) => {
  res.render('store');
});

app.use('/checkout', async (req, res) => {
  res.render('checkout');
});

// api
app.use('/api/v1/account', asyncHandler(accountRoutes));
app.use('/api/v1/customer', asyncHandler(customerRoutes));
app.use('/api/v1/cart', asyncHandler(cartRoutes));
app.use('/api/v1/product', asyncHandler(productRoutes));
app.use('/api/v1/invoice', asyncHandler(invoiceRoutes));

// Create Error 404 when not found path
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware
app.use(errorHandler);

module.exports = app;
