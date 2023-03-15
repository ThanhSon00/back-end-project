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
        return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/sign-in');
    }
    // Check phone

    // Check email

    // Check passwords
    if (password != rewrite_password) {
        res.cookie('message', 'Password are not matched', {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/sign-in');
    }
    response = await api.post('/customers', {
        name: name,
        phone: phone,
    })

    const { customer_id } = response.data;
    response = await api.post('/accounts', {
        customer_id: customer_id,
        email: email,
        password: password,
    });
    const account = response.data.account;
    const payload = {
        customer_id: account.customer_id,
        email: account.email,
    }
    await sendActivationEmail(payload);

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


const sendActivationEmail = async (payload) => {
    const link = getActivationLink(payload);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phanson999999@gmail.com',
            pass: 'fxkvgthoxpoalcrm'
        }
    })

    ejs.renderFile(path.resolve("./views/activate-account.ejs"), { link: link}, async function (err, data) {
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
    return `${rootURL}/register/${getJWT(payload)}`;
}

const getJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
}

const activateAccount = async (req, res) => {
    const { token } = req.params
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    await api.patch(`/accounts/${data.customer_id}`, {
        isNotActivated: false,
    });
    const payload = {
        customer_id: data.customer_id,
        email: data.email,
    }
    res.cookie('access_token', getJWT(payload), { 
        httpOnly: true,
    });
    res.cookie('message', 'Your account has been activated successfully!', {
        httpOnly: true,
    });
    res.cookie('messageType', 'Success', {
        httpOnly: true,
    })
    res.clearCookie('activate_token');
    return res.status(StatusCodes.OK).redirect(rootURL + '/home')
}

module.exports = {
    renderPage,
    registerAccount,
    activateAccount,
}