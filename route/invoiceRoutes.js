const express = require('express');
const router = express.Router();

const {
    getAllInvoice,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
} = require('../controllers/invoice.controller');

router.route('/')
                .get(getAllInvoice)
                .post(createInvoice);
router.route('/:invoice_id')
                .get(getInvoice)
                .patch(updateInvoice)
                .delete(deleteInvoice);

module.exports = router;