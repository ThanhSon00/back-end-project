const jwt = require('jsonwebtoken')
const axios = require('axios').default;
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const dotenv = require('dotenv').config();
const login = async (req, res) => {
    var message;
    const { email, password } = req.body;
    if (email == '' || password == '') {
        message = "Please fill both your email and password"
        return res.status(StatusCodes.BAD_REQUEST).render('logIn', { message: message });
    }
    let url = 'http://localhost:3000/api/v1/account/' + email;
    const response = await axios.get(url);
    const account = response.data;

    // Compare password
    const success = await bcrypt.compare(password, account.password);
    if (success) {
        if (account.isNotActivated) {
            message = "Your account has not been activated yet";
        }
        else {
            const token = getJWT(account);
            res.cookie('access_token', token, { 
                httpOnly: true,
            });
            return res.status(StatusCodes.OK).redirect('home');
        } 
    }
    else {
        message = "Email or password are not correct";
    }
    return res.status(StatusCodes.BAD_REQUEST).render('logIn', { message: message });
}

const getJWT = (account) => {
    const payload = {
        customer_id: account.customer_id,
        email: account.email,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}


module.exports = {
    login,
}

