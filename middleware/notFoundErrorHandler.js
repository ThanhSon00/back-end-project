const { root } = require('../bin/URL');

const notFoundErrorHandler = (req, res, next) => {
    res.render('error', { root: root.defaults.baseURL });
}

module.exports = notFoundErrorHandler;