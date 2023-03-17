const express = require('express');
const router = express.Router();

const {
    getAllCarts,
    getCart,
    createCart,
    updateCart,
    deleteCart,
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
    .delete(deleteCart);

router.route('/')
    .get(getAllCarts)
    .post(createCart);

module.exports = router;