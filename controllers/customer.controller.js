const Customer = require('../models/customer.model');
const { StatusCodes } = require('http-status-codes');

const getAllCustomers = async (req, res) => {
    const customers = await Customer.findAll();
    res.status(StatusCodes.OK).json(customers);
}

const createCustomer = async (req, res) => {
    const { phone, name } = req.body;
    const customer = await Customer.create({
        phone: phone,
        name: name,
    }, {
        fields: ['phone', 'name']
    });
    res.status(StatusCodes.CREATED).json(customer);
}

const getCustomer = async (req, res) => {
    const { params: { customer_id } } = req;
    const customer = await Customer.findOne({
        where: {
            customer_id: customer_id,
        }
    });
    res.status(StatusCodes.OK).json(customer);
}

const updateCustomer = async (req, res) => {
    const { params: { customer_id } } = req;
    const { name } = req.body;
    await Customer.update({
        name: name,
        phone: phone,
    }, {
        where: {
            customer_id: customer_id,
        }
    }, { fields: ['name', 'phone'] });
    res.status(StatusCodes.OK).send();
}

const deleteCustomer = async (req, res) => {
    const { params: { customer_id } } = req;
    await Customer.destroy({
        where: {
            customer_id: customer_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllCustomers,
    getCustomer,
    updateCustomer,
    createCustomer,
    deleteCustomer,
}