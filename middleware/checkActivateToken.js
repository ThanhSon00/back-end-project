const { StatusCodes } = require("http-status-codes");
const { root } = require('../bin/URL');
const rootURL = root.defaults.baseURL;
const jwt = require('jsonwebtoken');

const checkActivateToken = async (req, res, next) => {
    const activateToken = req.params.token;
    if (!activateToken) {
        return res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`);
    }
    jwt.verify(activateToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`);
        }
        req.body.customer_id = data.customer_id;
        req.body.email = data.email;
        req.body.cart_id = data.cart_id;
        return next();
    })
}

module.exports = checkActivateToken