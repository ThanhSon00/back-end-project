const express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('cookie-session');

const accountRoutes = require('./routes/account.routes');
const customerRoutes = require('./routes/customer.routes');
const cartRoutes = require('./routes/cart.routes');
const productRoutes = require('./routes/product.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const categoryRoutes = require('./routes/category.routes');

const refreshTokenRoutes = require('./routes/refreshToken.routes');

// Page Routes
const homeRoutes = require('./routes/home.routes');
const storeRoutes = require('./routes/store.routes');
const loginRoutes = require('./routes/login.routes');
const forgotPasswordRoutes = require('./routes/forgotPassword.routes');
const resetPasswordRoutes = require('./routes/resetPassword.routes');
const logoutRoutes = require('./routes/logout.routes');
const registerRoutes = require('./routes/register.routes');
const productDetailsRoutes = require('./routes/productDetails.routes');
const myCartRoutes = require('./routes/myCart.routes');
const tokenRoutes = require('./routes/token.routes');
const activateRoutes = require('./routes/activate.routes');

// Middleware
const checkLogged = require('./middleware/checkLogged');
const errorHandler = require('./middleware/errorHandler');
const asyncHandler = require('./middleware/asyncHandler');
const checkAccessToken = require('./middleware/checkAccessToken');
const checkRefreshToken = require('./middleware/checkRefreshToken');
const checkActivateToken = require('./middleware/checkActivateToken');

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

// resources api
app.use('/api/v1/accounts', asyncHandler(accountRoutes));
app.use('/api/v1/customers', asyncHandler(customerRoutes));
app.use('/api/v1/carts', asyncHandler(cartRoutes));
app.use('/api/v1/products', asyncHandler(productRoutes));
app.use('/api/v1/invoices', asyncHandler(invoiceRoutes));
app.use('/api/v1/categories', asyncHandler(categoryRoutes));
app.use('/api/v1/tokens', asyncHandler(refreshTokenRoutes));

// Page
app.use('/log-in',  checkLogged, asyncHandler(loginRoutes));
app.use('/register', checkLogged, asyncHandler(registerRoutes));
app.use('/forgot-password', checkLogged, asyncHandler(forgotPasswordRoutes));
app.use('/reset-password', checkLogged, asyncHandler(resetPasswordRoutes));
app.use('/home', checkAccessToken, asyncHandler(homeRoutes));
app.use('/store', checkAccessToken, asyncHandler(storeRoutes));
app.use('/cart', checkAccessToken, asyncHandler(myCartRoutes));
app.use('/products', checkAccessToken, asyncHandler(productDetailsRoutes));
app.use('/log-out', asyncHandler(logoutRoutes));
app.use('/refresh-token', checkRefreshToken, asyncHandler(tokenRoutes))
app.use('/activate/:token', checkActivateToken, asyncHandler(activateRoutes));
app.use('/', checkAccessToken, asyncHandler(homeRoutes))
app.use(errorHandler);

module.exports = app;
