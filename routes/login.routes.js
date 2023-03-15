const express = require('express');
const router = express.Router();

const {
    renderPage,
    login
} = require('../controllers/login.controller');

router.route('/')
            .get(renderPage)
            .post(login);

module.exports = router;