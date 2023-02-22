const express = require('express');
const router = express.Router();
const {
    getAllCustomer,
    getCustomer,
    updateCustomer,
    createCustomer,
    deleteCustomer,
} = require('../controllers/customer.controller');

router.route('/')
            .get(getAllCustomer)
            .post(createCustomer);

router.route('/:phoneNumber')
            .get(getCustomer)
            .patch(updateCustomer)
            .delete(deleteCustomer);

module.exports = router;