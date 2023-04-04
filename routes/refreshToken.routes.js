const express = require('express');
const router = express.Router();

const {
    validateToken,
    getTokens,
    createToken,
} = require('../controllers/refreshToken.controller');

router.route('/')
    .post(validateToken);

router.route('/:customer_id')
    .get(getTokens)
    .post(createToken);
module.exports = router;