const jwt = require('jsonwebtoken');
const { api } = require('../bin/URL');
const renderPage = async (req, res) => {
    const data = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);
    const { cart_id } = data;
    const cart = (await api.get(`/carts/${cart_id}`)).data;
    const cartProducts = (await api.get(`/carts/${cart_id}/products`)).data;
    const categories = (await api.get(`/categories`)).data;
    const message = req.cookies.message;
    const messageType = req.cookies.messageType;
    const products = (await api.get(`/products?pageSize=150&page=${randomIntFromInterval(1, 5)}`)).data.rows;
    res.clearCookie('message');
    res.clearCookie('messageType');
    return res.render('index', {
        message, 
        messageType,
        cart,
        cartProducts,
        categories,
        products,
    });  
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
    renderPage,
}