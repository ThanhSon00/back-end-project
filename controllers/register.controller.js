const { cookieAttributes, refreshTokenAttributes } = require('../setting/cookieAttributes')
const { api, root } = require('../bin/URL');
const rootURL = root.defaults.baseURL;
const apiURL = root.defaults.baseURL;
const { StatusCodes } = require('http-status-codes');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const path = require('path');

const renderPage = async (req, res) => {
    const message = req.cookies.message;
    res.clearCookie('message')
    res.render('register', {message: message});  
}

const registerAccount = async (req, res) => {
    var response;
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
        return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/register');
    }
    if (password != rewrite_password) {
        res.cookie('message', 'Password are not matched', {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/register');
    }
    response = await api.post('/customers', {
        name: name,
        phone: phone,
    })

    const { customer_id } = response.data;
    // Create cart for new customer
    const cart = (await api.post('/carts', {
        customer_id: customer_id,
    })).data;
    
    // Create account for new customer
    response = await api.post('/accounts', {
        customer_id: customer_id,
        email: email,
        password: password,
    });
    const account = response.data.account;
    const payload = {
        customer_id: account.customer_id,
        email: account.email,
        cart_id: cart.cart_id,
    }
    sendActivationEmail(payload);

    res.cookie('activate_token', getJWT(payload), {
        httpOnly: true,
    })
    res.cookie('message', 'Verification mail has been sent to ' + email, {
        httpOnly: true,
    })
    res.cookie('messageType', 'Success', {
        httpOnly: true,
    })
    res.status(StatusCodes.OK).redirect(rootURL + '/log-in');
}


const sendActivationEmail = (payload) => {
    const link = getActivationLink(payload);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phanson999999@gmail.com',
            pass: process.env.APP_PASSWORD
        }
    })

    ejs.renderFile(path.resolve("./views/activate-account.ejs"), { link: link }, async function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: 'phanson999999@gmail.com',
                to: payload.email,
                subject: "E-commerce: Activate your account",
                html: data
            };
            await transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            });
        }
    }); 
}

const getActivationLink = (payload) => {
    return `${rootURL}/activate/${getJWT(payload)}`;
}

const getJWT = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });
}


module.exports = {
    renderPage,
    registerAccount,
}