const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { cookieAttributes } = require('../setting/cookieAttributes')
const checkLogged = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return next();
    }
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    } catch (err) {
        res.clearCookie('access_token', cookieAttributes);
        return next();
    }
    return res.status(StatusCodes.OK).redirect('home');
}

module.exports = checkLogged;