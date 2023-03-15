const express = require('express');
const router = express.Router();

const {
    renderPage,
} = require('../controllers/store.controller');

router.route('/').get(renderPage);

module.exports = router;