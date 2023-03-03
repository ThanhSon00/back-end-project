const Account = require("../models/account.model");
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');

const getAllAccounts = async (req, res) => {
    const accounts = await Account.findAll();
    res.status(StatusCodes.OK).json({ accounts });
}


const createAccount = async (req, res) => {
    const { customer_id, password, email } = req.body;
    const hash = crypto.randomBytes(128).toString('hex');
    const account = await Account.create({
        customer_id: customer_id,
        email: email,
        password: password,
        hash: hash,
    }, { fields: ['customer_id', 'password', 'hash', 'email'] });
    res.status(StatusCodes.CREATED).json({ account });
}

const updateAccount = async (req, res) => {
    const customer_id = req.params.key;
    const { password } = req.body;

    await Account.update({
        password: password,
    }, {
        where: {
            customer_id: customer_id,
        }
    }, { fields: ['password'] });
    res.status(StatusCodes.OK).send();
}

const deleteAccount = async (req, res) => {
    const customer_id = req.params.key;
    await Account.destroy({
        where: {
            customer_id: customer_id,
        }
    });
    res.status(StatusCodes.OK).send();
}

const activateAccount = async (req, res) => {
    const { params: {
        customer_id,
        hash,
    } } = req;
    const account = await Account.findOne({
        where: {
            customer_id: customer_id,
        }
    });
    if (account.hash == hash) {
        await Account.update({
            isNotActivated: false,
        }, {
            where: {
                customer_id: customer_id,
            }
        }, { fields: ['isNotActivated'] });

        const token = getJWT(account);
        res.cookie('access_token', token, { 
            httpOnly: true,
        });
        return res.status(StatusCodes.OK).redirect('../../home')
    }
    return res.status(StatusCodes.NOT_ACCEPTABLE).send('Wrong hash');
}

const getAccount = async (req, res) => {
    const key = req.params.key;
    if (isNumeric(key)) {
        await getAccountById(req, res);
    }
    else {
        await getAccountByEmail(req, res);
    }
}

const getAccountById = async (req, res) => {
    const customer_id = req.params.key;
    const account = await Account.findOne({
        where: {
            customer_id: customer_id,
        }
    });
    res.status(StatusCodes.OK).json(account);
}

const getAccountByEmail = async (req, res) => {
    const email = req.params.key;
    const account = await Account.findOne({
        where: {
            email: email,
        }
    })
    res.status(StatusCodes.OK).json(account);
}

const getJWT = (account) => {
    const payload = {
        customer_id: account.customer_id,
        email: account.email,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

const isNumeric = (variable) => {
    return !isNaN(variable);
}
module.exports = {
    getAccount,
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    activateAccount,
}