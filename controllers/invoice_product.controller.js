const InvoiceProduct = require('../models/invoice_product.model');
const { StatusCodes } = require('http-status-codes');

const getAllInvoiceProducts = async (req, res) => {
    const invoiceProducts = await InvoiceProduct.findAll();
    res.status(StatusCodes.OK).json(invoiceProducts)
}

const getInvoiceProduct = async (req, res) => {
    const {
        params: {
            invoice_id,
            product_id,
        }
    } = req;
    const invoiceProduct = await InvoiceProduct.findOne({
        where: {
            invoice_id: invoice_id,
            product_id: product_id,
        }
    });
    res.status(StatusCodes.OK).json(invoiceProduct);
}

const createInvoiceProduct = async (req, res) => {
    const {
        invoice_id,
        product_id,
        amount,
    } = req.body;
    const invoiceProduct = await InvoiceProduct.create({
        invoice_id: invoice_id,
        product_id: product_id,
        amount: amount,
    }, { fields: ['invoice_id', 'product_id', 'amount'] });
    res.status(StatusCodes.CREATED).json(invoiceProduct);
}

const updateInvoiceProduct = async (req, res) => {
    const {
        params: {
            invoice_id,
            product_id,
        }
    } = req;
    const { amount } = req.body;
    await InvoiceProduct.update({
        amount: amount,
    }, {
        where: {
            invoice_id: invoice_id,
            product_id: product_id,
        }
    }, { fields: ['amount'] });
}

const deleteInvoiceProduct = async (req, res) => {
    const {
        params: {
            invoice_id,
            product_id,
        }
    } = req;
    await InvoiceProduct.destroy({
        where: {
            invoice_id: invoice_id,
            product_id: product_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllInvoiceProducts,
    getInvoiceProduct,
    updateInvoiceProduct,
    createInvoiceProduct,
    deleteInvoiceProduct,
}