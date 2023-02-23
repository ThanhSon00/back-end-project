const express = require('express');
const router = express.Router();

const {
    getAllCart,
    getCart,
    createCart,
    updateCart,
    deleteCart,
} = require('../controllers/cart.controller')

router.route('/')
                .get(getAllCart)
                .post(createCart);
router.route('/:cart_id')
                .get(getCart)
                .patch(updateCart)
                .delete(deleteCart);

module.exports = router;