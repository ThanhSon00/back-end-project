const Account = require("../models/account.model");
const { StatusCodes } = require('http-status-codes')

const getAllAccount = async (req, res) => {
    const accounts = await Account.findAll();
    res.status(StatusCodes.OK).json({accounts});
}

const getAccount = async (req, res) => {
    const {
        params: { phoneNumber },
      } = req;
        
    const account = await Account.findAll({
        where: {
            phoneNumber: phoneNumber,
        }
    });
    res.status(StatusCodes.OK).json({account});
}

const createAccount = async (req, res) => {
    const { phoneNumber, password } = req.body;
    const account = await Account.create({
        phoneNumber: phoneNumber,
        password: password,
    }, { fields: ['phoneNumber', 'password']});
    res.status(StatusCodes.CREATED).json({account});
}

const updateAccount = async (req, res) => {
    const {
        params: { phoneNumber }
      } = req;
    const { password } = req.body;
    await Account.update({
        password: password,
    }, {
        where: {
            phoneNumber: phoneNumber,
        }
    }, { fields: ['password']});
    res.status(StatusCodes.OK).send();
}

const deleteAccount = async (req, res) => {
    const {
        params: { phoneNumber }
      } = req;
    await Account.destroy({
        where: {
            phoneNumber: phoneNumber,
        }
    });
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAccount, 
    getAllAccount,
    createAccount,
    updateAccount,
    deleteAccount,
}