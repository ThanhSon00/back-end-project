const Category = require('../models/category.model');
const { StatusCodes } = require('http-status-codes');

const getCategory = async (req, res) => {
    const { params: {
        category_id,
    } } = req;
    const category = await Category.findOne({
        where: {
            category_id: category_id
        }
    })
    return res.status(StatusCodes.OK).json(category);
}

const getAllCategories = async (req, res) => {
    const { name } = req.query;
    if (!name) {
        const categories = await Category.findAll();
        return res.status(StatusCodes.OK).json(categories);
    }
    const categories = await Category.findAll({
        where: {
            name: name,
        }
    });
    return res.status(StatusCodes.OK).json(categories);
}

const updateCategory = async (req, res) => {
    const { params: {
        category_id,
    } } = req;
    const { name } = req.body;
    await Category.update({
        name: name,
    }, {
        where: {
            category_id: category_id,
        }
    }, { fields: ['name'] });
    return res.status(StatusCodes.OK).send();

}

const createCategory = async (req, res) => {
    const { name } = req.body;
    const category = await Category.create({
        name: name,
    }, { fields: ['name'] });
    return res.status(StatusCodes.CREATED).json(category);
}

const deleteCategory = async (req, res) => {
    const { params: {
        category_id,
    }} = req;
    await Category.destroy({
        where: {
            category_id: category_id,
        }
    });
    return res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
}