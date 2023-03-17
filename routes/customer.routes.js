const express = require('express');
const router = express.Router();

const {
    getAllCustomers,
    getCustomer,
    updateCustomer,
    createCustomer,
    deleteCustomer,
    getCustomerCart,
} = require('../controllers/customer.controller');

router.route('/:customer_id/carts')
    .get(getCustomerCart);

router.route('/:customer_id')
    .get(getCustomer)
    .patch(updateCustomer)
    .delete(deleteCustomer);

router.route('/')
    .get(getAllCustomers)
    .post(createCustomer);


module.exports = router;