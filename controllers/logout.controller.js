const { root, api } = require('../bin/URL');
const { StatusCodes } = require('http-status-codes');
const rootURL = root.defaults.baseURL;
const jwt = require('jsonwebtoken');
const moment = require('moment');

const logout = async (req, res) => {
    const ttl = process.env.REFRESH_TOKEN_TTL;
    const refreshToken = req.cookies.refresh_token;
    const data = parseJwt(refreshToken);
    
    await api.post(`/tokens/${data.customer_id}`, {
        jti: data.jti,
        expiration: moment(new Date()).add(parseInt(ttl.replace('m')), 'minutes').toDate().toISOString(),
    })
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.status(StatusCodes.OK).redirect(rootURL + '/log-in');
}

const parseJwt = (token) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

module.exports = {
    logout,
}