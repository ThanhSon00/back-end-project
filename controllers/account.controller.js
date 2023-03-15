const Account = require("../models/account.model");
const { StatusCodes } = require('http-status-codes')

// CRUD API
const getAllAccounts = async (req, res) => {
    const { email } = req.query;
    let where = {};
    if (email) {
        where.email = email;
    }
    const accounts = await Account.findAll({
        where: where,
    });
    res.status(StatusCodes.OK).json({ accounts });
}

const createAccount = async (req, res) => {
    const { customer_id, password, email } = req.body;
    const account = await Account.create({
        customer_id: customer_id,
        email: email,
        password: password,
    }, { fields: ['customer_id', 'password', 'email'] });
    res.status(StatusCodes.CREATED).json({ account });
}

const updateAccount = async (req, res) => {
    const { customer_id } = req.params;
    const { password, isNotActivated } = req.body;
    const updateData = {};
    const fields = [];
    if (password) {
        updateData.password = password;
        fields.push('password');
    }
    if (isNotActivated || isNotActivated == false) {
        updateData.isNotActivated = isNotActivated;
        fields.push('isNotActivated');
    }
    await Account.update(updateData, {
        where: {
            customer_id: customer_id,
        }
    }, { 
        fields: fields,
        individualHooks: true, });
    res.status(StatusCodes.OK).send();
}

const deleteAccount = async (req, res) => {
    const { customer_id } = req.params;
    await Account.destroy({
        where: {
            customer_id: customer_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

const getAccount = async (req, res) => {
    const { customer_id } = req.params;
    if (checkIfEmailInString(customer_id)) {
        await getAccountByEmail(req, res);
    }
    else {
        await getAccountById(req, res);        
    }
}

module.exports = {
    getAccount,
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
}