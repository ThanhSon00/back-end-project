const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer')
const ejs = require('ejs');
const { api, root } = require('../bin/URL');
const rootURL = root.defaults.baseURL;

const renderPage = async (req, res) => {
    const message = req.cookies.message;
    res.clearCookie('message')
    return res.render('forgot-password', {message: message});  
}

const sendResetPassMail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.cookie('message', 'Please fill your email', {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/forgot-password');
    }
    const response = await api.get(`/accounts?email=${email}`);
    const account = response.data.accounts[0];
    if (!account) {
        res.cookie('message', 'Account not found', {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/forgot-password');
    } else {
        await sendPassResetEmail(account);
        res.cookie('message', `Password reset link has been sent to ${email}`, {
            httpOnly: true,
        });
        res.cookie('messageType', 'Success', {
            httpOnly: true,
        });  
        return res.status(StatusCodes.OK).redirect(rootURL + '/log-in');
    }
}

const sendPassResetEmail = async (account) => {
    const link = await getPassResetLink(account);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phanson999999@gmail.com',
            pass: process.env.APP_PASSWORD
        }
    })
    ejs.renderFile(path.resolve("./views/verify-email.ejs"), {link: link}, function (err, data) {
        if (err) {
        } else {
            var mainOptions = {
                from: 'phanson999999@gmail.com',
                to: account.email,
                subject: "E-commerce: Reset password",
                html: data
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            });
        }
    }); 
}

const getPassResetLink = async (account) => {
    const payload = {
        customer_id: account.customer_id,
        email: account.email,
    }
    const token = getJWT(payload);
    return `${rootURL}/reset-password/${token}`;
}

const getJWT = (payload) => {
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

module.exports = {
    sendResetPassMail,
    renderPage,
}