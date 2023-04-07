const { root, api } = require('../bin/URL');
const { StatusCodes } = require('http-status-codes');
const rootURL = root.defaults.baseURL;
const moment = require('moment');
const jwt = require('jsonwebtoken');

const refreshAccessToken = async (req, res) => {
    const payload = req.body;
    res.clearCookie('access_token');
    if (await refreshTokenIsValid(payload)) {
        delete payload.path
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_TTL });
        res.cookie('access_token', accessToken);
        return res.status(StatusCodes.OK).redirect(`${rootURL}/home`);
    } else {
        res.clearCookie('refresh_token');
        return res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`);
    }
}

const refreshTokenIsValid = async (payload) => {
    const tokens = (await api.get(`/tokens/${payload.customer_id}`)).data;
    const tokenInBlacklist = tokens.map(token => token.jti).includes(payload.jti);
    if (tokenInBlacklist) {
        return false;
    }
    return true;
}

const revokeRefreshToken = async (req, res) => {
    const payload = req.body;
    const ttl = process.env.REFRESH_TOKEN_TTL;

    await api.post(`/tokens/${payload.customer_id}`, {
        jti: payload.jti,
        expiration: moment(new Date()).add(parseInt(ttl.replace('m')), 'minutes').toDate().toISOString(),
    })
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
    return res.redirect(`${rootURL}/log-in`);
}

module.exports = {
    refreshAccessToken,
    revokeRefreshToken,
}

