const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetail,
} = require('../controllers/product.controller');

router.route('/:product_id/details')
    .get(getProductDetail);

router.route('/:product_id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct);

router.route('/')
    .get(getAllProducts)
    .post(createProduct);

module.exports = router;