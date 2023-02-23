const Invoice = require('../models/invoice.model');
const { StatusCodes } = require('http-status-codes');

const getAllInvoice = async (req, res) => {
    const invoices = await Invoice.findAll({
        where: {
            status: true,
        }
    })
    res.status(StatusCodes.OK).json(invoices);
}

const getInvoice = async (req, res) => {
    const { params: { invoice_id }} = req;
    const invoice = await Invoice.findAll({
        where: {
            invoice_id: invoice_id,
            status: true,
        }
    });
    res.status(StatusCodes.OK).json(invoice);
}

const createInvoice = async (req, res) => {
    const { customer_id } = req.body;
    const invoice = await Invoice.create({
        customer_id: customer_id,
    }, { fields: ['customer_id']});
    res.status(StatusCodes.CREATED).json(invoice);
}

const updateInvoice = async (req, res) => {
    const { params: { invoice_id }} = req;
    const { totalAmount, totalMoney } = req.body;
    await Invoice.update({
        totalAmount: totalAmount,
        totalMoney: totalMoney,
    }, {
        where: {
            invoice_id: invoice_id,
            status: true,
        } 
    }, { fields: ['totalAmount', 'totalMoney']});
    res.status(StatusCodes.OK).send();
}

const deleteInvoice = async (req, res) => {
    const { params: { invoice_id }} = req;
    await Invoice.destroy({
        where: {
            invoice_id: invoice_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllInvoice,
    getInvoice,
    updateInvoice,
    deleteInvoice,
    createInvoice,
}