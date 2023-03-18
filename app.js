const express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var bodyParser = require('body-parser');
var session = require('express-session');

// Resource Routes (Rest API)
const accountRoutes = require('./routes/account.routes');
const customerRoutes = require('./routes/customer.routes');
const cartRoutes = require('./routes/cart.routes');
const productRoutes = require('./routes/product.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const categoryRoutes = require('./routes/category.routes');

// Page Routes
const homeRoutes = require('./routes/home.routes');
const storeRoutes = require('./routes/store.routes');
const loginRoutes = require('./routes/login.routes');
const forgotPasswordRoutes = require('./routes/forgotPassword.routes');
const resetPasswordRoutes = require('./routes/resetPassword.routes');
const logoutRoutes = require('./routes/logout.routes');
const registerRoutes = require('./routes/register.routes');

// Partial Routes
const headerRoutes = require('./routes/header.routes');

const checkLogged = require('./middleware/checkLogged');
const errorHandler = require('./middleware/errorHandler');
const asyncHandler = require('./middleware/asyncHandler');
const authorization = require('./middleware/authorization');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'SomeRandomKey',
  resave: false,
  saveUninitialized: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Page
app.use('/header', asyncHandler(headerRoutes));
app.use('/log-in', checkLogged, asyncHandler(loginRoutes));
app.use('/store', authorization, asyncHandler(storeRoutes));
app.use('/forgot-password', checkLogged, asyncHandler(forgotPasswordRoutes));
app.use('/reset-password', checkLogged, asyncHandler(resetPasswordRoutes));
app.use('/log-out', authorization, asyncHandler(logoutRoutes));
app.use('/register', checkLogged, asyncHandler(registerRoutes));
app.use('/home', authorization, asyncHandler(homeRoutes));

app.use('/product', authorization, async (req, res) => {
  res.render('product');
});


app.use('/check-out', authorization, async (req, res) => {
  res.render('check-out');
});

app.use('/blank', authorization, async (req, res) => {
  res.render('blank');
});


// api
app.use('/api/v1/accounts', asyncHandler(accountRoutes));
app.use('/api/v1/customers', asyncHandler(customerRoutes));
app.use('/api/v1/carts', asyncHandler(cartRoutes));
app.use('/api/v1/products', asyncHandler(productRoutes));
app.use('/api/v1/invoices', asyncHandler(invoiceRoutes));
app.use('/api/v1/categories', asyncHandler(categoryRoutes));
// Create Error 404 when not found path
app.use(function (req, res, next) {
  next(createError(404));
});

// Middleware
app.use(errorHandler);

module.exports = app;
