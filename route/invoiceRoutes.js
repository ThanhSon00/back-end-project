const express = require('express');
const router = express.Router();
const {
    getInvoiceProduct,
    getAllInvoiceProducts,
    createInvoiceProduct,
    deleteInvoiceProduct,
    updateInvoiceProduct,
} = require('../controllers/invoice_product.controller');

const {
    getAllInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
} = require('../controllers/invoice.controller');

router.route('/product/')
                .get(getAllInvoiceProducts)
                .post(createInvoiceProduct);

router.route('/')
                .get(getAllInvoices)
                .post(createInvoice);
router.route('/:invoice_id')
                .get(getInvoice)
                .patch(updateInvoice)
                .delete(deleteInvoice);

router.route('/:invoice_id/product/:product_id')
                .get(getInvoiceProduct)
                .patch(updateInvoiceProduct)
                .delete(deleteInvoiceProduct);
module.exports = router;