const { Cart } = require('../models/models');
const { StatusCodes } = require('http-status-codes');

const getCart = async (req, res) => {
    const { cart_id } = req.params;
    const cart = await Cart.findOne({
        where: {
            cart_id: cart_id,
        }
    });
    const objData = JSON.parse(JSON.stringify(cart, null, 4));
    objData._links = [];
    objData._links.push(getProductLink(cart_id));
    return res.status(StatusCodes.OK).json(objData);
}

const getProductLink = (cart_id) => {
    return {
        rel: "product",
        href: `/carts/${cart_id}/products`,
        method: "GET",
    }
}

const createCart = async (req, res) => {
    const { customer_id } = req.body;
    const cart = await Cart.create({
        customer_id: customer_id,
    }, {
        fields: ['customer_id']
    })
    return res.status(StatusCodes.CREATED).json(cart);
}

const updateCart = async (req, res) => {
    const { params: { cart_id } } = req;
    const { totalAmount } = req.body;
    await Cart.update({
        totalAmount: totalAmount,
    }, {
        where: {
            cart_id: cart_id,
        }
    }, { fields: ['totalAmount'] });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getCart,
    createCart,
    updateCart,
}