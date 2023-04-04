const { api } = require('../bin/URL');
const {
    getRelatedResource,
} = require('./store.controller')

const renderPage = async (req, res) => {
    const { customer_id } = req.body;
    const customer = (await api.get(`/customers/${customer_id}`)).data;
    const cart = await getRelatedResource(customer, 'cart');
    const cartProducts = getRelatedResource(cart, 'product');
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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
    renderPage,
}