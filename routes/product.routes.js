const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

const {
    getInvoiceProduct,
    getAllInvoiceProducts,
    updateInvoiceProduct,
    createInvoiceProduct,
    deleteInvoiceProduct,
} = require('../controllers/invoice_product.controller');

router.route('/invoices/')
    .get(getAllInvoiceProducts)
    .post(createInvoiceProduct);

router.route('/')
    .get(getAllProducts)
    .post(createProduct);
router.route('/:product_id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct);
router.route('/:product_id/invoices/:invoice_id')
    .get(getInvoiceProduct)
    .patch(updateInvoiceProduct)
    .delete(deleteInvoiceProduct);


module.exports = router;