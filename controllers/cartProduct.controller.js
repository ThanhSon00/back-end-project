

const { StatusCodes } = require('http-status-codes');
const { CartProduct, Product, Cart } = require('../models/models');
const createCartProduct = async (req, res) => {
    const { cart_id } = req.params;
    const { product_id, amount } = req.body;
    const cartProduct = await CartProduct.upsert({
        product_id: product_id,
        amount: amount,
        cart_id: cart_id,
    }, { fields: ['cart_id', 'product_id', 'amount']})
    return res.status(StatusCodes.OK).json(cartProduct);
}

const updateCartProduct = async (req, res) => {
    const { cart_id } = req.params;
    await CartProduct.update({
        amount: amount
    }, {
        where: {
            cart_id: cart_id,
        }
    }, { fields: ['amount']});
    return res.status(StatusCodes.OK).send();
}

const deleteCartProduct = async (req, res) => {
    const { cart_id, product_id } = req.params;
    await CartProduct.destroy({
        where: {
            product_id: product_id,
            cart_id: cart_id,
        },
        individualHooks: true
    });
    return res.status(StatusCodes.OK).send();
}

const getProductsInCart = async (req, res) => {
    const { cart_id } = req.params;
    const cartProducts = await Cart.findOne({
        include: Product,
    }, {
        where: {
            cart_id: cart_id,
    }});
    const objData = JSON.parse(JSON.stringify(cartProducts, null, 4));
    return res.status(StatusCodes.OK).json(objData);
}

module.exports = {
    createCartProduct,
    updateCartProduct,
    deleteCartProduct,
    getProductsInCart,
}