const Invoice = require('../models/invoice.model');
const { StatusCodes } = require('http-status-codes');

const getAllInvoice = async (req, res) => {
    const invoices = Invoice.findAll({
        where: {
            status: true,
        }
    })
    res.status(StatusCodes.OK).json(invoices);
}