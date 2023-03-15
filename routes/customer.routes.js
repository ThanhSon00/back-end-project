const express = require('express');
const router = express.Router();
const {
    getAllCustomers,
    getCustomer,
    updateCustomer,
    createCustomer,
    deleteCustomer,
} = require('../controllers/customer.controller');

router.route('/')
    .get(getAllCustomers)
    .post(createCustomer);

router.route('/:customer_id')
    .get(getCustomer)
    .patch(updateCustomer)
    .delete(deleteCustomer);

module.exports = router;