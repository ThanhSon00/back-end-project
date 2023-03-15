const express = require('express');
const router = express.Router();
const {
    renderPage,
} = require('../controllers/home.controller');

router.route('/').get(renderPage);

module.exports = router;