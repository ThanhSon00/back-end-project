const express = require('express');
const router = express.Router();

const {
    renderPage,
    sendResetPassMail,
} = require('../controllers/forgotPassword.controller');

router.route('/')
            .get(renderPage)
            .post(sendResetPassMail);

module.exports = router;