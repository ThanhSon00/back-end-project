const express = require('express');
const router = express.Router();

const {
    renderPage,
    login,
    googleLogin,
    refreshToken,
} = require('../controllers/login.controller');

router.route('/')
            .get(renderPage)
            .post(login);

router.route('/google')
            .post(googleLogin);

router.route('/refresh')
            .get(refreshToken);
module.exports = router;