const { StatusCodes } = require("http-status-codes");
const { root, api } = require('../bin/URL');
const rootURL = root.defaults.baseURL;
const jwt = require('jsonwebtoken');
const { cookieAttributes, refreshTokenAttributes } = require('../setting/cookieAttributes')
const checkRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        res.clearCookie('access_token', cookieAttributes);
        res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`);
        return;
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, data) => {
        if (err || await refreshTokenIsNotValid(data)) {
            res.clearCookie('access_token', cookieAttributes);
            res.clearCookie('refresh_token', refreshTokenAttributes);
            res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`);
            return;
        }
        req.body.cart_id = data.cart_id;
        req.body.email = data.email;
        req.body.customer_id = data.customer_id;
        req.body.jti = data.jti;
        return next();
    })
}

const refreshTokenIsNotValid = async (payload) => {
    const tokens = (await api.get(`/tokens/${payload.customer_id}`)).data;
    const tokenInBlacklist = tokens.map(token => token.jti).includes(payload.jti);
    if (tokenInBlacklist) {
        return true;
    }
    return false;
}

module.exports = checkRefreshToken;