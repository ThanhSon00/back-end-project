const express = require('express');
const router = express.Router();

const {
    getAccount,
    getAllAccounts,
    updateAccount,
    createAccount,
    deleteAccount,
} = require('../controllers/account.controller');

router.route('/:customer_id')
    .get(getAccount)
    .patch(updateAccount)
    .delete(deleteAccount);

router.route('/')
    .get(getAllAccounts)
    .post(createAccount);



module.exports = router;