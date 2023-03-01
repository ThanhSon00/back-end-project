const express = require('express');
const router = express.Router();
const { activateAccount } = require('../controllers/account.controller');
router.route('/:customer_id/:hash').get(activateAccount);

module.exports = router;