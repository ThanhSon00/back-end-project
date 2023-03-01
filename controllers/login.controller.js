const axios = require('axios').default;
const bcrypt = require('bcryptjs');
const login = async (req, res) => {
    const { email, password} = req.body;
    let url = 'http://localhost:3000/api/v1/account/' + email;
    const response = await axios.get(url);
    const account = response.data;

    // Compare password
    const success = await bcrypt.compare(password, account.password);
    if (success) {
        if (account.isNotActivated) {
            throw new Error('Your account has not been activated yet!');
        }
        res.render('index');
    }
    else res.render('login');
}

module.exports = {
    login,
}

