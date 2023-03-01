const axios = require('axios').default;
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const { startServer } = require('forever');
const login = async (req, res) => {
    var message;
    const { email, password } = req.body;
    if (email == '' || password == '') {
        message = "Please fill both your email and password"
        res.status(StatusCodes.BAD_REQUEST).render('logIn', {message: message});
        return;
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
        else res.status(StatusCodes.OK).redirect('home');
    }
    else {
        message = "Email or password are not correct";
    }
    res.status(StatusCodes.BAD_REQUEST).render('logIn', {message: message});
    return;
}

module.exports = {
    login,
}

