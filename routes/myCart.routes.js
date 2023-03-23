const express = require('express');
const router = express.Router();

const {
    renderPage,
} = require('../controllers/myCart.controller');

router.route('/')
    .get(renderPage);

module.exports = router;