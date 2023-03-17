const express = require('express');
const router = express.Router();

const {
    renderPage,
    addProductToCart
} = require('../controllers/store.controller');

router.route('/')
            .get(renderPage)
            .post(addProductToCart);
module.exports = router;