const axios = require('axios').default;
const bcrypt = require('bcryptjs');
const checkLogin = async (req, res) => {
    const { email, password } = req.body;
    let url = 'http://localhost:3000/api/v1/account/' + email.toString();
    const response = await axios.get(url);
    const yourString = JSON.stringify(response.data.account)
    var result = yourString.substring(1, yourString.length-1);
    const account = JSON.parse(result);
    console.log(account.password);
    // Compare password
    bcrypt.compare(password, account.password, (error, success) => {
        if (success) {
            console.log('success');
            res.render('index');
        }
        else res.render('login')
    });
}

module.exports = {
    checkLogin,
}

