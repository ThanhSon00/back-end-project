const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const authorization = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).redirect('log-in'); 
    }
    try {
        const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.body.customer_id = data.customer_id;
        req.body.email = data.email;
    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).send();
    }
    return next();   
}

module.exports = authorization;