const Account = require("../models/account.model");
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto');
const getAllAccounts = async (req, res) => {
    const accounts = await Account.findAll();
    res.status(StatusCodes.OK).json({accounts});
}

const getAccount = async (req, res) => {
    const {
        params: { email },
      } = req;    
        
    const account = await Account.findOne({
        where: {
            email: email,
        }
    });
    res.status(StatusCodes.OK).json({account});
}

const createAccount = async (req, res) => {
    const { email, password, customer_id} = req.body;
    const hash = crypto.randomBytes(128).toString('hex');
    const account = await Account.create({
        customer_id: customer_id,
        email: email,
        password: password,
        hash: hash,
    }, { fields: ['customer_id', 'email', 'password', 'hash']});
    res.status(StatusCodes.CREATED).json({account});
}

const updateAccount = async (req, res) => {
    const {
        params: { email }
      } = req;
    const { password } = req.body;
    
    await Account.update({
        password: password,
    }, {
        where: {
            email: email,
        }
    }, { fields: ['password']});
    res.status(StatusCodes.OK).send();
}

const deleteAccount = async (req, res) => {
    const {
        params: { email }
      } = req;
    await Account.destroy({
        where: {
            email: email,
        }
    });
    res.status(StatusCodes.OK).send();
}

const activateAccount = async (req, res) => {
    const { params: {
        email,
        hash,
    }} = req;
    const account = await Account.findOne({
        where: {
            email: email,
        }
    });
    if (account.hash == hash) {
        await Account.update({
            isNotActivated: false,
        }, {
            where: {
                email: email,
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