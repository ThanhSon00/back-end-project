const { Customer, Cart } = require('../models/models');
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
    const objData = JSON.parse(JSON.stringify(customer, null, 4));
    objData._links = [];
    objData._links.push(getCartLink(customer_id));
    objData._links.push(getAccountLink(customer_id));
    res.status(StatusCodes.OK).json(objData);
}

const getCartLink = (customer_id) => {
    return {
        rel: "cart",
        href: `/customers/${customer_id}/carts`,
        method: "GET"
    }
}

const getAccountLink = (customer_id) => {
    return {
        rel: "account",
        href: `/customers/${customer_id}/accounts`,
        method: "GET",
    }
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

const getCustomerCart = async (req, res) => {
    const { customer_id } = req.params;
    const customerCart = await Cart.findOne({
        where: {
            customer_id: customer_id
        }
    })
    const objData = JSON.parse(JSON.stringify(customerCart));
    objData._links = [];
    objData._links.push(getProductsLink(customerCart.cart_id));
    res.status(StatusCodes.OK).json(objData);
}

const getProductsLink = (cart_id) => {
    return {
        rel: "product",
        href: `carts/${cart_id}/products`,
        method: "GET",
    }
}

module.exports = {
    getAllCustomers,
    getCustomer,
    updateCustomer,
    createCustomer,
    deleteCustomer,
    getCustomerCart,
}