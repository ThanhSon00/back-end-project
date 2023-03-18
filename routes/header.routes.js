const express = require('express');
const router = express.Router();

const {
    deleteCartProduct
} = require('../controllers/header.controller');

router.route('/')
    .delete(deleteCartProduct);

module.exports = router;