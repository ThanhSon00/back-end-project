const { StatusCodes } = require("http-status-codes");
const { root } = require('../bin/URL');
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
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
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

module.exports = checkRefreshToken;