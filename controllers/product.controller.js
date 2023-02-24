const Product = require('../models/product.model');
const { StatusCodes } = require('http-status-codes');

const getAllProducts = async (req, res) => {
    const products = await Product.findAll();
    res.status(StatusCodes.OK).json(products);
}

const getProduct = async (req, res) => {
    const { params: { product_id }} = req;
    const product = await Product.findAll({
        where: {
            product_id: product_id,
        }
    });
    res.status(StatusCodes.OK).json(product);
}

const createProduct = async (req, res) => {
    const {
        name, 
        amount,
        image,
        price,
        description,
    } = req.body;

    const product = await Product.create({
        name: name,
        amount: amount,
        image: image,
        price: price,
        description: description,
    }, {
        fields: ['name', 'amount', 'image', 'price', 'description']
    })
    res.status(StatusCodes.CREATED).json(product)
}

const updateProduct = async (req, res) => {
    const { params: { product_id }} = req;
    const {
        name, 
        amount,
        image,
        price,
        description,
    } = req.body;
    await Product.update({
        name: name,
        amount: amount,
        image: image,
        price: price,
        description: description,
    }, {
        where: {
            product_id: product_id,
    }}, { 
        fields: ['name', 'amount', 'image', 'price', 'description']
    });
    res.status(StatusCodes.OK).send();
}

const deleteProduct = async (req, res) => {
    const { params: { product_id }} = req;
    await Product.destroy({
        where: {
            product_id: product_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}