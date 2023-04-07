const { StatusCodes } = require('http-status-codes');
const { api } = require('../bin/URL');

const {
    getRelatedResource,
} = require('./store.controller');

const renderPage = async (req, res) => {
    const { customer_id } = req.body;
    const customer = (await api.get(`/customers/${customer_id}`)).data;
    const cart = await getRelatedResource(customer, 'cart');
    const cartProducts = await getRelatedResource(cart, 'product');
    return res.status(StatusCodes.OK).render('cart', {
        cart,
        cartProducts,
    })
}

module.exports = {
    renderPage,
}