const Customer = require('../models/customer.model');
const { StatusCodes} = require('http-status-codes');

const getAllCustomer = async (req, res) => {
    const customers = await Customer.findAll();
    res.status(StatusCodes.OK).json(customers);
}

const createCustomer = async (req, res) => {
    const { phone, name, email } = req.body;
    const customer = await Customer.create({
        phone: phone,
        name: name,
        email: email,
    }, {
        fields: ['phone', 'name', 'email']
    });
    res.status(StatusCodes.CREATED).json(customer);
}

const getCustomer = async (req, res) => {
    const { params: { phoneNumber } } = req;
    const customer = await Customer.findAll({
        where: {
            phone: phoneNumber,
        }
    });
    res.status(StatusCodes.OK).json(customer);
}

const updateCustomer = async (req, res) => {
    const {params: { phoneNumber }} = req;
    const { name, email } = req.body;
    await Customer.update({
        name: name,
        email: email,
    }, {
        where: {
            phone: phoneNumber,
        }
    }, {fields: ['name', 'email']});
    res.status(StatusCodes.OK).send();
}

const deleteCustomer = async (req, res) => {
    const { params: { phoneNumber }} = req;
    await Customer.destroy({
        where: {
            phone: phoneNumber,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllCustomer,
    getCustomer,
    updateCustomer,
    createCustomer,
    deleteCustomer,
}