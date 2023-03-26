const { StatusCodes } = require('http-status-codes');
const {
    getCurrentCustomer,
    getRelatedResource,
} = require('./store.controller');
const renderPage = async (req, res) => {
    const customer = await getCurrentCustomer(req.cookies.access_token);
    const cart = await getRelatedResource(customer, 'cart');
    const cartProducts = (await getRelatedResource(cart, 'product'));
    return res.status(StatusCodes.OK).render('check-out', {
        cart,
        cartProducts,
    })
}

module.exports = {
    renderPage,
}