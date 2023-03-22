const { ProductDetail } = require('../models/models');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { api } = require('../bin/URL');
const {
    getCurrentCustomer,
    getRelatedResource,
} = require('./store.controller')

const renderPage = async (req, res) => {
    const { product_id } = req.params;
    const customer = await getCurrentCustomer(req.cookies.access_token);
    const cart = (await getRelatedResource(customer, 'cart'))
    const cartProducts = (await getRelatedResource(cart, 'product')).Products;
    
    return res.render('product', {
        cart,
        cartProducts,
    });
}

module.exports = {
    renderPage,
}