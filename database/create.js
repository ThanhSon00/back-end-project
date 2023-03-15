const Customer = require('../models/customer.model');
const Cart_Product = require('../models/cart_product.model');
const Invoice_Product = require('../models/invoice_product.model');
const Category = require('../models/category.model');
const sequelize = require('./connect');

sequelize.sync({ force: true })
  .then(() => {
    console.log('All models synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to sync models:', err);
  });