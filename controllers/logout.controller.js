const { root, api } = require('../bin/URL');
const { StatusCodes } = require('http-status-codes');
const rootURL = root.defaults.baseURL;

const logout = async (req, res) => {
    res.redirect('/refresh-token/revoke');    
}

module.exports = {
    logout,
}