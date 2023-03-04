const express = require('express');
const router = express.Router();

const {
    getAccount,
    getAllAccounts,
    updateAccount,
    createAccount,
    deleteAccount,
    loginAccount,
    logoutAccount,
    activateAccount,
    signInAccount,
    forgotAccountPassword,
    resetAccountPassword,
    resetPassword,
} = require('../controllers/account.controller');

router.route('/reset-password').post(resetPassword);

router.route('/reset-password/:token').get(resetAccountPassword);

router.route('/activate/:hash').get(activateAccount);

router.route('/forgot-password').post(forgotAccountPassword);

router.route('/log-in').post(loginAccount);

router.route('/log-out').get(logoutAccount);

router.route('/sign-in').post(signInAccount);

router.route('/:key')
    .get(getAccount)
    .patch(updateAccount)
    .delete(deleteAccount);

router.route('/')
    .get(getAllAccounts)
    .post(createAccount);



module.exports = router;