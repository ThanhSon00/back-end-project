const renderPage = async (req, res) => {
    const message = req.cookies.message;
    const messageType = req.cookies.messageType;
    res.clearCookie('message');
    res.clearCookie('messageType');
    res.render('index', {message: message, messageType: messageType});  
}

module.exports = {
    renderPage,
}