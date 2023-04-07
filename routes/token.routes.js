const express = require('express');
const router = express.Router();

const {
    refreshAccessToken,
    revokeRefreshToken,
} = require('../controllers/token.controller')

router.route('/revoke')
    .get(revokeRefreshToken);

router.route('/refresh')
    .get(refreshAccessToken);

module.exports = router;