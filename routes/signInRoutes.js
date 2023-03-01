const { signIn } = require('../controllers/signIn.controller');
const express = require('express');
const router = express.Router();

router.route('/').post(signIn);

module.exports = router;