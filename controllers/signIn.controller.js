const axios = require('axios');

const signIn = async (req, res) => {
    let url, response;
    const { email, password, phone, name } = req.body;
    url = 'http://localhost:3000/api/v1/customer/'
    response = await axios.post(url, {
        name: name,
        phone: phone,
    });


    const customer_id = response.data.customer_id;
    url = 'http://localhost:3000/api/v1/account/'
    response = await axios.post(url, {
        customer_id: customer_id,
        email: email,
        password: password,
    });


    res.render('login');
}

const sendEmail = async (email) => {
    const link = await getLink(email);

}

const getLink = async (email) => {
    const url = 'http://localhost:3000/api/v1/account/' + email.toString();
    const response = await axios.get(url);
    const accountString = JSON.stringify(response.data.account);
    var result = accountString.substring(1, accountString.length-1);
    const account = JSON.parse(result);
    return "http://localhost:3000/activation/" + account.email + "/" + account.hash;
}