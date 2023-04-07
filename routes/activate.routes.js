const express = require('express');
const router = express.Router();

const {
    activateAccount
} = require('../controllers/activate.controller');

router.route('/')
    .get(activateAccount);

module.exports = router;