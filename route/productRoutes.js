const express = require('express');
const router = express.Router();

const {
    getAllProduct,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

router.route('/')
                .get(getAllProduct)
                .post(createProduct);
router.route('/:product_id')
                .get(getProduct)
                .patch(updateProduct)
                .delete(deleteProduct);

module.exports = router;