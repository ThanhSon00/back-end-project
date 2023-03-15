const { root } = require('../bin/URL');
const { StatusCodes } = require('http-status-codes');
const rootURL = root.defaults.baseURL;

const logout = async (req, res) => {
    res.clearCookie('access_token');
    res.status(StatusCodes.OK).redirect(rootURL + '/log-in');
}

module.exports = {
    logout,
}