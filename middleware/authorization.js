const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const authorization = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).redirect('log-in'); 
    }

    await jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, data) => {
        if (err) {
            res.clearCookie('access_token');
            return res.status(StatusCodes.FORBIDDEN).redirect('log-in');
        }
        req.body.customer_id = data.customer_id;
        req.body.email = data.email;
        return next();
    });
    
}

module.exports = authorization;