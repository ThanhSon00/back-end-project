const express = require('express');
const router = express.Router();

const {
    getAccount, 
    getAllAccounts, 
    updateAccount, 
    createAccount, 
    deleteAccount
} = require('../controllers/account.controller');

router.route('/')
                .get(getAllAccounts)
                .post(createAccount);
router.route('/:phoneNumber')
                .get(getAccount)
                .patch(updateAccount)
                .delete(deleteAccount);

module.exports = router;