const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken');
const { api, root } = require('../bin/URL');
const rootURL = root.defaults.baseURL;

const redirectPage = async (req, res) => {
    const { token } = req.params;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`)
        }
    });
    res.cookie('reset_pass_token', token, {
        httpOnly: true,
    })
    res.status(StatusCodes.ACCEPTED).redirect(`${rootURL}/reset-password`);
}

const renderPage = async (req, res) => {
    const message = req.cookies.message;
    res.clearCookie('message')
    res.render('reset-password', {message: message});
}

const resetPassword = async (req, res) => {
    var message;
    const token = req.cookies.reset_pass_token;
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).redirect(rootURL + '/log-in');
    }
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const { password, verify_password } = req.body;
    if (!password|| !verify_password) {
        message = "Please fill all the information";
    }
    if (password != verify_password) {
        message = "Passwords are not matched";
    }
    if (message) {
        res.cookie('message', message, {
            httpOnly: true,
        });
        return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/reset-password');
    }
    await api.patch(`/accounts/${data.customer_id}`, {
        password: password,
    });     
    res.clearCookie('reset_pass_token');
    res.cookie('message', 'Your password has been updated successfully', {
        httpOnly: true,
    });
    res.cookie('messageType', 'Success', {
        httpOnly: true,
    });
    return res.status(StatusCodes.OK).redirect(rootURL + '/log-in');
}

module.exports = {
    redirectPage,
    renderPage,
    resetPassword
}