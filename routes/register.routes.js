const express = require('express');
const router = express.Router();

const {
    renderPage,
    registerAccount, 
    activateAccount,   
} = require('../controllers/register.controller');

router.route('/')
                .get(renderPage)
                .post(registerAccount);
router.route('/:token')
                .get(activateAccount);

module.exports = router;
