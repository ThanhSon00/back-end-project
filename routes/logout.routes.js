const express = require('express');
const router = express.Router();

const {
    logout
} = require('../controllers/logout.controller');

router.route('/').post(logout);

module.exports = router;