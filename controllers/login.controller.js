const { api, root } = require('../bin/URL');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const rootURL = root.defaults.baseURL;
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const uuid = require('uuid');
const moment = require('moment');

const login = async (req, res) => {
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
            const tokens = getTokens(payload)
            res.cookie('access_token', tokens.accessToken, { 
                httpOnly: true,
                secure: true,
                
            });
            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                path: '/login/refresh'
            })
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
    const tokens = getTokens(payload);
    res.cookie('access_token', tokens.accessToken, { 
        httpOnly: true,
        secure: true,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/login/refresh'
    })
    return res.status(StatusCodes.OK).redirect('/home');
}

const getTokens = (payload) => {
    const jti = uuid.v4();
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_TTL, jwtid: jti});
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_TTL });
    return {
        refreshToken,
        accessToken,
    }
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

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    res.clearCookie('access_token');
    if (await refreshTokenIsValid(refreshToken)) {
        const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        const payload = {
            customer_id: data.customer_id,
            cart_id: data.cart_id,
            email: data.email,
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_TTL });
        res.cookie('access_token', accessToken);
        res.status(StatusCodes.OK).redirect(`${root.defaults.baseURL}/home`);
    } else {
        res.clearCookie('refresh_token');
        return res.status(StatusCodes.UNAUTHORIZED).redirect(`${rootURL}/log-in`);
    }
}


const refreshTokenIsValid = async (refreshToken) => {
    try {
        const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        const tokens = (await api.get(`/tokens/${data.customer_id}`)).data;
        const tokenInBlacklist = tokens.map(token => token.jti).includes(data.jti);
        if (tokenInBlacklist) {
            return false;
        }
    } catch (err) {
        return false;
    }
    return true;
}


module.exports = {
    login,
    renderPage,
    googleLogin,
    createNewData,
    refreshToken,
}