const { api } = require('../bin/URL');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const deleteCartProduct = async (req, res) => {
    const { product_id } = req.body;
    const data = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);
    const { cart_id } = data;
    await api.delete(`/carts/${cart_id}/products/${product_id}`);
    return res.status(StatusCodes.OK).json(product_id);
}

module.exports = {
    deleteCartProduct,
}