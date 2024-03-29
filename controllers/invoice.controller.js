

const { Invoice } = require('../models/models');
const { StatusCodes } = require('http-status-codes');

const getAllInvoices = async (req, res) => {
    const invoices = await Invoice.findAll();
    res.status(StatusCodes.OK).json(invoices);
}

const getInvoice = async (req, res) => {
    const { params: { invoice_id } } = req;
    const invoice = await Invoice.findOne({
        where: {
            invoice_id: invoice_id,
        }
    });
    res.status(StatusCodes.OK).json(invoice);
}

const createInvoice = async (req, res) => {
    const { customer_id } = req.body;
    const invoice = await Invoice.create({
        customer_id: customer_id,
    }, { fields: ['customer_id'] });
    res.status(StatusCodes.CREATED).json(invoice);
}

const updateInvoice = async (req, res) => {
    const { params: { invoice_id } } = req;
    const { totalAmount, totalMoney } = req.body;
    await Invoice.update({
        totalAmount: totalAmount,
        totalMoney: totalMoney,
    }, {
        where: {
            invoice_id: invoice_id,
        }
    }, { fields: ['totalAmount', 'totalMoney'] });
    res.status(StatusCodes.OK).send();
}

const deleteInvoice = async (req, res) => {
    const { params: { invoice_id } } = req;
    await Invoice.destroy({
        where: {
            invoice_id: invoice_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllInvoices,
    getInvoice,
    updateInvoice,
    deleteInvoice,
    createInvoice,
}