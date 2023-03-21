const express = require('express');
const router = express.Router();

const {
    renderPage,
    login,
    googleLogin,
} = require('../controllers/login.controller');

router.route('/')
            .get(renderPage)
            .post(login);

router.route('/google')
            .post(googleLogin);
module.exports = router;