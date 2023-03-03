const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const authorization = async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return res.status(StatusCodes.UNAUTHORIZED).redirect('log-in'); 
    }
    try {
        const data = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
        req.body.customer_id = data.customer_id;
        req.body.email = data.email;
    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).send();
    }
    return next();   
}

module.exports = authorization;