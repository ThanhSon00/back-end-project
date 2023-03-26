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
    const cart = await getRelatedResource(customer, 'cart')
    const cartProducts = await getRelatedResource(cart, 'product');
    const productDetails = (await api.get(`/products/${product_id}/details`)).data;
    const productImages = productDetails.image.replaceAll('US40', 'SX420').split('|');
    const product = (await api.get(`/products/${product_id}`)).data;
    const random = randomIntFromInterval(1, 14);
    const relatedProducts = (await api.get(`/products?category_id=${product.category_id}&pageSize=4&page=${random}`)).data;
    const productCategory = (await api.get(`/products/${product_id}/categories`)).data;
    return res.render('product', {
        cart,
        cartProducts,
        productDetails,
        productImages,
        product,
        relatedProducts: relatedProducts.rows,
        productCategory,
    });
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

module.exports = {
    renderPage,
}