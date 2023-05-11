const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { root, api } = require('../bin/URL');
const rootURL = root.defaults.baseURL;
const { cookieAttributes } = require('../setting/cookieAttributes')
const checkAccessToken = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`);
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, async (err, data) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(StatusCodes.OK).redirect('/refresh-token/refresh');
            } else {
                res.clearCookie('access_token', cookieAttributes);
                res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`);
            }
        } else {
            req.body.customer_id = data.customer_id;
            return next();
        }
    })
}

module.exports = checkAccessToken