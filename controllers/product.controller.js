

const { Product } = require('../models/models');
const { StatusCodes } = require('http-status-codes');
const { Op } = require("sequelize");
// price=gte:10&price=lte:100

const getAllProducts = async (req, res) => {
    const { page, pageSize, category_id, price } = req.query;
    var limit, offset, minPrice, maxPrice, categoryFilter, priceFilter;
    if (category_id) {
      categoryFilter = {
        id: category_id,
      }
    }
    if (price) {
      price.forEach(price => {
        if (price.startsWith('gte')) {
            minPrice = price.split(':')[1];
            } else if (price.startsWith('lte')) {
            maxPrice = price.split(':')[1];
        }
      });
      priceFilter = {
        min: minPrice,
        max: maxPrice,
      };
      if (!priceFilter.min || !priceFilter.max) {
        priceFilter = '';
      }
    }
    if (page && pageSize) {
        limit = parseInt(pageSize);
        offset = (page * pageSize) - pageSize;
    }
    let where = {};
    if (priceFilter || categoryFilter) {
      if (categoryFilter) {
        where.category_id = categoryFilter.id;
      }
      if (priceFilter) {
          where.price = {
            [Op.between]: [priceFilter.min, priceFilter.max]
          }
      }
    }
  
    const products = await Product.findAndCountAll({
        where,
        limit: limit,
        offset: offset,
    });
    return res.status(StatusCodes.OK).json(products);
}


const getProduct = async (req, res) => {
    const { product_id } = req.params;
    const product = await Product.findOne({
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
    }, { fields: ['name', 'amount', 'image', 'price', 'description'] })
    res.status(StatusCodes.CREATED).json(product)
}

const updateProduct = async (req, res) => {
    const { product_id } = req.params;
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
        }
    }, { fields: ['name', 'amount', 'image', 'price', 'description'] });
    res.status(StatusCodes.OK).send();
}

const deleteProduct = async (req, res) => {
    const { product_id } = req.params;
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