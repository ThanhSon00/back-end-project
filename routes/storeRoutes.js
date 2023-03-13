const express = require('express');
const router = express.Router();

const {
    storeController,
} = require('../controllers/store.controller');

router.route('/').get(storeController);

module.exports = router;