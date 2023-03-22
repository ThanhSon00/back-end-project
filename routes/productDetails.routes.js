const express = require('express');
const router = express.Router();

const {
    renderPage
} = require('../controllers/productDetails.controller')

router.route('/:product_id')
    .get(renderPage);

module.exports = router;