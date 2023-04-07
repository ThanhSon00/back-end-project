const { api } = require('../bin/URL');
const { cookieAttributes, refreshTokenAttributes } = require('../setting/cookieAttributes')
const { StatusCodes } = require('http-status-codes');
const { root } = require('../bin/URL');
const rootURL = root.defaults.baseURL;

const {
    getTokens,
} = require('./login.controller')

const activateAccount = async (req, res) => {
    
    const { customer_id, email, cart_id } = req.body;
    await api.patch(`/accounts/${customer_id}`, {
        isNotActivated: false,
    });
    const payload = {
        customer_id,
        email,
        cart_id,
    }

    const tokens = getTokens(payload);
    res.cookie('access_token', tokens.accessToken, cookieAttributes);
    res.cookie('refresh_token', tokens.refreshToken, refreshTokenAttributes);
    res.cookie('message', 'Your account has been activated successfully!', { httpOnly: true });
    res.cookie('messageType', 'Success', { httpOnly: true })
    res.clearCookie('activate_token');
    return res.status(StatusCodes.OK).redirect(rootURL + '/home')
}

module.exports = {
    activateAccount,
}