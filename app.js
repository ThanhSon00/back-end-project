const express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');

const accountRoutes = require('./route/accountRoutes');
const customerRoutes = require('./route/customerRoutes');
const cartRoutes = require('./route/cartRoutes');
const productRoutes = require('./route/productRoutes');
const invoiceRoutes = require('./route/invoiceRoutes');

const errorHandler = require('./middleware/errorHandler');
const asyncHandler = require('./middleware/asyncHandler');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
