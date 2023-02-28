const Account = require("../models/account.model");
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto');
const getAllAccounts = async (req, res) => {
    const accounts = await Account.findAll();
    res.status(StatusCodes.OK).json({accounts});
}

const getAccount = async (req, res) => {
    const {
        params: { customer_id },
      } = req;    
        
    const account = await Account.findOne({
        where: {
            customer_id: customer_id,
        }
    });
    res.status(StatusCodes.OK).json({account});
}

const createAccount = async (req, res) => {
    const { customer_id, password } = req.body;
    const hash = crypto.randomBytes(128).toString('hex');
    const account = await Account.create({
        customer_id: customer_id,
        customer_id: customer_id,
        password: password,
        hash: hash,
    }, { fields: ['customer_id', 'password', 'hash']});
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

const activateAccount = async (req, res) => {
    const { params: {
        customer_id,
        hash,
    }} = req;
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
        }, { fields: ['isNotActivated']});
        res.status(StatusCodes.OK).send('Account has been activated!');
    }
    else res.status(StatusCodes.NOT_ACCEPTABLE).send('Wrong hash');
    
}
module.exports = {
    getAccount, 
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    activateAccount,
}