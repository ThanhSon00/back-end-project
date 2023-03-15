const express = require('express');
const router = express.Router();

const {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/category.controller');

router.route('/:category_id')
    .get(getCategory)
    .patch(updateCategory)
    .delete(deleteCategory);

router.route('/')
    .get(getAllCategories)
    .post(createCategory);

module.exports = router;