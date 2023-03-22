const express = require('express');
const router = express.Router();

const {
    renderPage,
} = require('../controllers/store.controller');


router.route('/')
            .get(renderPage)

router.route('/:product_id')
            .get()
            
module.exports = router;