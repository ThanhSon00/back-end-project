const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const checkLogged = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return next();
    }
    try {
        await jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    } catch (err) {
        res.clearCookie('access_token');
        return next();
    }
    return res.status(StatusCodes.OK).redirect('home');
}

module.exports = checkLogged;