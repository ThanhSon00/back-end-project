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

module.exports = router;
