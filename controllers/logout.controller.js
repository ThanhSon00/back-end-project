const logout = async (req, res) => {
    res.clearCookie("access_token");
    res.redirect('log-in');
}

module.exports = logout;