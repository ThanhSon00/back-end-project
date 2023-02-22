const Cart = require('../models/cart.model');
const { StatusCodes } = require('http-status-codes');

const getAllCart = async (req, res) => {
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