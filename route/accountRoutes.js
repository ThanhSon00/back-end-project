const express = require('express');
const router = express.Router();

const {
    getAccount, 
    getAllAccount, 
    updateAccount, 
    createAccount, 
    deleteAccount
} = require('../controllers/account.controller');

router.route('/')
                .get(getAllAccount)
                .post(createAccount);
router.route('/:phoneNumber')
                .get(getAccount)
                .patch(updateAccount)
                .delete(deleteAccount);

module.exports = router;