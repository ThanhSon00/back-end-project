const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const checkLogged = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return next();
    }
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    } catch (err) {
        return next();
    }
    return res.status(StatusCodes.OK).redirect('home');
}

module.exports = checkLogged;