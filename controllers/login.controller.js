const { api, root } = require('../bin/URL');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const rootURL = root.defaults.baseURL;
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    var message, success;
    const { email, password } = req.body;
    if (!email || !password) {
        message = "Please fill both your email and password";
    }
    const response = await api.get(`/accounts?email=${email}`);
    const account = response.data.accounts[0];
    if (!message) {
        if (!account) {
            message = "Email or password are not correct";
        }
        else success = await bcrypt.compare(password, account.password);
    }
    
    if (success) {
        if (account.isNotActivated) {
            message = "Your account has not been activated yet";
        }
        else {
            const payload = {
                customer_id: account.customer_id,
                email: account.email,
            }
            const token = getJWT(payload);
            res.cookie('access_token', token, { 
                httpOnly: true,
            });
            return res.status(StatusCodes.OK).redirect(rootURL + '/home');
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
    return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/log-in');
}

const getJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

const renderPage = async (req, res) => {
    const message = req.cookies.message; 
    const messageType = req.cookies.messageType;
    res.clearCookie('message');
    res.clearCookie('messageType')
    res.render('log-in', {message: message, messageType: messageType});  
}

module.exports = {
    login,
    renderPage,
}