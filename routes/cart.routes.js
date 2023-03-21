const express = require('express');
const router = express.Router();

const {
    getCart,
    createCart,
    updateCart,
} = require('../controllers/cart.controller')

const {
    createCartProduct, 
    updateCartProduct,
    deleteCartProduct,
    getProductsInCart
} = require('../controllers/cartProduct.controller');

router.route('/:cart_id/products/:product_id')
    .patch(updateCartProduct)
    .delete(deleteCartProduct);

router.route('/:cart_id/products')
    .get(getProductsInCart)
    .post(createCartProduct)
    
router.route('/:cart_id')
    .get(getCart)
    .patch(updateCart)

router.route('/')
    .post(createCart);

module.exports = router;