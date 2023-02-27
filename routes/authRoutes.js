const express = require('express');
const router = express.Router();

const { checkLogin } = require('../controllers/auth.controller');

router.route('/').post(checkLogin);

module.exports = router;