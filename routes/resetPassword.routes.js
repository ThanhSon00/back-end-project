const express = require('express');
const router = express.Router();

const {
    renderPage,
    resetPassword,
    redirectPage,
} = require('../controllers/resetPassword.controller');

router.route('/:token')
                .get(redirectPage);
                
router.route('/')
                .get(renderPage)
                .post(resetPassword);

module.exports = router;