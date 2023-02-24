const Cart = require('../models/cart.model');
const { StatusCodes } = require('http-status-codes');

const getAllCarts = async (req, res) => {
    const carts = await Cart.findAll();
    res.status(StatusCodes.OK).json(carts);
}

const getCart = async (req, res) => {
    const { params: {cart_id} } = req;
    const cart = await Cart.findAll({
        where: {
            cart_id: cart_id,
        }
    });
    res.status(StatusCodes.OK).json(cart);
}

const createCart = async (req, res) => {
    const { customer_id } = req.body;
    const cart = await Cart.create({
        customer_id: customer_id,
    }, {
        fields: ['customer_id']
    })
}

const updateCart = async (req, res) => {
    const { params: { cart_id }} = req;
    const { totalAmount } = req.body;
    await Cart.update({
        totalAmount: totalAmount,
    }, {
        where: {
            cart_id: cart_id,
        }
    }, { fields: ['totalAmount']});
    res.status(StatusCodes.OK).send();
}

const deleteCart = async (req, res) => {
    const { params: { cart_id }} = req;
    await Cart.destroy({
        where: {
            cart_id: cart_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllCarts,
    getCart,
    createCart,
    updateCart,
    deleteCart,
}