const { api, root } = require('../bin/URL');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const rootURL = root.defaults.baseURL;
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const login = async (req, res) => {
    const token = req.body.credential;
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const data = await verify(client, token);

    var message, success;
    const { email, password } = req.body;
    if (!email || !password) {
        message = "Please fill both your email and password";
    }
    const response = await api.get(`/accounts?email=${email}`);
    const account = response.data.accounts[0];
    if (!message) {
        if (!account) {
            message = "Email or password are not correct";
        }
        else success = await bcrypt.compare(password, account.password);
    }
    
    if (success) {
        if (account.isNotActivated) {
            message = "Your account has not been activated yet";
        }
        else {
            const cart = (await api.get(`/customers/${account.customer_id}/carts`)).data;
            const payload = {
                customer_id: account.customer_id,
                cart_id: cart.cart_id,
                email: account.email,
            }
            const token = getJWT(payload);
            res.cookie('access_token', token.accessToken, { 
                httpOnly: true,
                sameSite: 'Strict',
                secure: true,
            });
            return res.status(StatusCodes.OK).redirect(rootURL + '/home');
        } 
    }
    else {
        if (message == null) {
            message = "Email or password are not correct";
        }
    }
    res.cookie('message', message, { 
        httpOnly: true,
    });
    return res.status(StatusCodes.BAD_REQUEST).redirect(rootURL + '/log-in');
}

const getJWT = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
    return {
        accessToken,
    }
}

const renderPage = async (req, res) => {
    const message = req.cookies.message; 
    const messageType = req.cookies.messageType;
    res.clearCookie('message');
    res.clearCookie('messageType')
    res.render('log-in', {message: message, messageType: messageType});  
}

const googleLogin = async (req, res) => {
    const token = req.body.credential;
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const data = await verify(client, token);
    const response = (await api.get(`/accounts?email=${data.email}`));
    let account = response.data.accounts[0];
    if (!account) {
        account = await createNewData(data);
    }
    const cart = (await api.get(`/customers/${account.customer_id}/carts`)).data;
    const payload = {
        customer_id: account.customer_id,
        email: account.email, 
        cart_id: cart.cart_id,
    }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
    })
    return res.status(StatusCodes.OK).redirect('/home');
}

const verify = async (client, token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, 
    });
    return ticket.getPayload();
}

const createNewData = async (data) => {
    var response;
    response = await api.post('/customers', {
        name: data.name,
        phone: Math.random().toString(16).substring(2, 8),
    })
    const { customer_id } = response.data;
    await api.post('/carts', {
        customer_id: customer_id,
    })
    response = await api.post('/accounts', {
        customer_id: customer_id,
        email: data.email,
        password: Math.random().toString(16).substring(2, 8),
    });
    return response.data.account;
}


module.exports = {
    login,
    renderPage,
    googleLogin,
    createNewData,
}