const jwt = require('jsonwebtoken');
const { api } = require('../bin/URL');
const renderPage = async (req, res) => {
    const data = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);
    const { cart_id } = data;
    const cart = (await api.get(`/carts/${cart_id}`)).data;
    const cartProducts = (await api.get(`/carts/${cart_id}/products`)).data.Products;
    const message = req.cookies.message;
    const messageType = req.cookies.messageType;
    res.clearCookie('message');
    res.clearCookie('messageType');
    return res.render('index', {
        message, 
        messageType,
        cart,
        cartProducts,
    });  
}

module.exports = {
    renderPage,
}