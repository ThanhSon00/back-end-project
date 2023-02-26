const Account = require("../models/account.model");
const { StatusCodes } = require('http-status-codes')

const getAllAccounts = async (req, res) => {
    const accounts = await Account.findAll();
    res.status(StatusCodes.OK).json({accounts});
}

const getAccount = async (req, res) => {
    const {
        params: { customer_id },
      } = req;
        
    const account = await Account.findAll({
        where: {
            customer_id: customer_id,
        }
    });
    res.status(StatusCodes.OK).json({account});
}

const createAccount = async (req, res) => {
    const { email, password, customer_id } = req.body;
    const account = await Account.create({
        customer_id: customer_id,
        email: email,
        password: password,
    }, { fields: ['customer_id', 'email', 'password']});
    res.status(StatusCodes.CREATED).json({account});
}

const updateAccount = async (req, res) => {
    const {
        params: { customer_id }
      } = req;
    const { password } = req.body;
    await Account.update({
        password: password,
    }, {
        where: {
            customer_id: customer_id,
        }
    }, { fields: ['password']});
    res.status(StatusCodes.OK).send();
}

const deleteAccount = async (req, res) => {
    const {
        params: { customer_id }
      } = req;
    await Account.destroy({
        where: {
            customer_id: customer_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAccount, 
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
}