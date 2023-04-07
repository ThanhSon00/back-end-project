const express = require('express');
const router = express.Router();

const {
    validateRefreshToken,
    getRefreshTokens,
    createRefreshToken,
} = require('../controllers/refreshToken.controller');

router.route('/')
    .post(validateRefreshToken);

router.route('/:customer_id')
    .get(getRefreshTokens)
    .post(createRefreshToken);

module.exports = router;