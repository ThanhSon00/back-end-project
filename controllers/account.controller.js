const Account = require("../models/account.model");
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer')
const ejs = require('ejs');
const bcrypt = require('bcryptjs');
const { get } = require("http");

const prefixPath = '../../../';
// CRUD API
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
    }, { 
        fields: ['password'],
        individualHooks: true, });
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

const getAccount = async (req, res) => {
    const key = req.params.key;
    if (isNumeric(key)) {
        await getAccountById(req, res);
    }
    else {
        await getAccountByEmail(req, res);
    }
}
// Normal API
const activateAccount = async (req, res) => {
    const { params: {
        token,
    } } = req;
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const account = await Account.findOne({
        where: {
            customer_id: data.customer_id,
        }
    });
    if (account.isNotActivated) {
        await Account.update({
            isNotActivated: false,
        }, {
            where: {
                customer_id: data.customer_id,
            }
        }, { fields: ['isNotActivated'] });

        const token = getJWT(account);
        res.cookie('access_token', token, { 
            httpOnly: true,
        });
        res.cookie('message', 'Your account has been activated successfully!', {
            httpOnly: true,
        });
        res.cookie('messageType', 'Success', {
            httpOnly: true,
        })
        return res.status(StatusCodes.OK).redirect(prefixPath + '../home')
    }
    return res.status(StatusCodes.NOT_ACCEPTABLE).send('Wrong hash');
}

const logoutAccount = async (req, res) => {
    res.clearCookie("access_token");
    res.redirect(prefixPath + 'log-in');
}

const loginAccount = async (req, res) => {
    var message = null, success = false;
    const { email, password } = req.body;
    if (email == '' || password == '') {
        message = "Please fill both your email and password";
    }
    let url = 'http://localhost:3000/api/v1/account/' + email;
    const response = await axios.get(url);
    const account = response.data;
    if (message == null) {
        if (account == null) {
            message = "Email or password are not correct";
        }
        else success = await bcrypt.compare(password, account.password);
    }
    
    if (success) {
        if (account.isNotActivated) {
            message = "Your account has not been activated yet";
        }
        else {
            const token = getJWT(account);
            res.cookie('access_token', token, { 
                httpOnly: true,
            });
            return res.status(StatusCodes.OK).redirect(prefixPath + 'home');
        } 
    }
    else {
        if (message == null) {
            message = "Email or password are not correct";
        }
    }
    res.cookie('message', message, { 
        httpOnly: true,
    });
    return res.status(StatusCodes.BAD_REQUEST).redirect(prefixPath + 'log-in');
}

const signInAccount = async (req, res) => {
    let url, response;
    const {
        email,
        password,
        phone,
        name,
        rewrite_password
    } = req.body;

    // Check all information filled
    if (email == '' || password == '' || phone == '' || name == '' || rewrite_password == '') {
        res.cookie('message', 'Please fill all the information', {
            httpOnly: true,
        })
        return res.status(StatusCodes.BAD_REQUEST).redirect(prefixPath + 'sign-in');
    }
    // Check phone

    // Check email

    // Check passwords
    if (password != rewrite_password) {
        res.cookie('message', 'Password are not matched', {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(prefixPath + 'sign-in');
    }
    url = 'http://localhost:3000/api/v1/customer/'
    response = await axios.post(url, {
        name: name,
        phone: phone,
    });


    const customer_id = response.data.customer_id;
    url = 'http://localhost:3000/api/v1/account/'
    response = await axios.post(url, {
        customer_id: customer_id,
        email: email,
        password: password,
    });
    sendActivationEmail(customer_id, email);
    res.cookie('message', 'Verification mail has been sent to ' + email, {
        httpOnly: true,
    })
    res.cookie('messageType', 'Success', {
        httpOnly: true,
    })
    res.status(StatusCodes.OK).redirect(prefixPath + 'log-in');
}

const forgotAccountPassword = async (req, res) => {
    const { email } = req.body;
    if (email == '') {
        res.cookie('message', 'Please fill your email', {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(prefixPath + 'forgot-password');
    }
    let url = "http://localhost:3000/api/v1/account/" + email;
    const response = await axios.get(url);
    const account = response.data;
    if (account == null) {
        res.cookie('message', 'Account not found', {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(prefixPath + 'forgot-password');
    } else {
        sendPassResetEmail(account.customer_id, account.email);
        res.cookie('message', 'Password reset link has been sent to ' + email, {
            httpOnly: true,
        });
        res.cookie('messageType', 'Success', {
            httpOnly: true,
        });  
        return res.status(StatusCodes.OK).redirect(prefixPath + 'log-in');
    }

}

const resetAccountPassword = async (req, res) => {
    const { params: {
        token,
    }} = req;
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.cookie('reset_pass_token', token, {
        httpOnly: true,
    })
    res.status(StatusCodes.OK).redirect(prefixPath + '../' + 'reset-password');
}

const resetPassword = async (req, res) => {
    let message;
    const token = req.cookies.reset_pass_token;
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { password, verify_password } = req.body;
    if (password == '' || verify_password == '') {
        message = "Please fill all the information";
    }
    if (password != verify_password) {
        message = "Passwords are not matched";
    }
    if (message != null) {
        res.cookie('message', message, {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(prefixPath + 'reset-password');
    }
    const url = "http://localhost:3000/api/v1/account/" + data.customer_id;
    await axios.patch(url, {
        password: password,
    });
    res.clearCookie('reset_pass_token');
    res.cookie('message', 'Your password has been updated successfully', {
        httpOnly: true,
    });
    res.cookie('messageType', 'Success', {
        httpOnly: true,
    });
    return res.status(StatusCodes.OK).redirect(prefixPath + 'log-in');
}
//

const sendPassResetEmail = async (customer_id, email) => {
    const link = await getPassResetLink(customer_id);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phanson999999@gmail.com',
            pass: 'fxkvgthoxpoalcrm'
        }
    })
    ejs.renderFile(path.resolve("./views/verify-email.ejs"), {link: link}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: 'phanson999999@gmail.com',
                to: email,
                subject: "E-commerce: Reset password",
                html: data
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    }); 
}

const getPassResetLink = async (customer_id) => {
    const url = 'http://localhost:3000/api/v1/account/' + customer_id.toString();
    const response = await axios.get(url);
    const account = response.data;
    const token = getJWT(account);
    return "http://localhost:3000/api/v1/account/reset-password/" + token;
}

const sendActivationEmail = async (customer_id, email) => {
    const link = await getActivationLink(customer_id);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phanson999999@gmail.com',
            pass: 'fxkvgthoxpoalcrm'
        }
    })

    ejs.renderFile(path.resolve("./views/verify-email.ejs"), {link: link}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: 'phanson999999@gmail.com',
                to: email,
                subject: "E-commerce: Verify your email",
                html: data
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    }); 
}

const getActivationLink = async (customer_id) => {
    const url = 'http://localhost:3000/api/v1/account/' + customer_id.toString();
    const response = await axios.get(url);
    const account = response.data;
    const token = getJWT(account);
    return "http://localhost:3000/api/v1/account/activate/" + token;
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
    logoutAccount,
    loginAccount,
    signInAccount,
    forgotAccountPassword,
    resetAccountPassword,
    resetPassword,
}