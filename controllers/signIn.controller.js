const axios = require('axios');
const nodemailer = require('nodemailer')
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
    sendEmail(customer_id, email);
    res.render('email-verification');
}

const sendEmail = async (customer_id, email) => {
    const link = await getLink(customer_id);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phanson999999@gmail.com',
            pass: 'fxkvgthoxpoalcrm'
        }
    })

    const mailConfigs = {
        from: 'phanson999999@gmail.com',
        to: email,
        subject: 'Sign up verification mail',
        text: link,
    }
    transporter.sendMail(mailConfigs, (err, info) => {
        if (err) {
            console.log(err);
            return reject({message: 'An error has occurred'})
        } return resolve({message: "Email sent successfully"});
        
    })

}

const getLink = async (customer_id) => {
    const url = 'http://localhost:3000/api/v1/account/' + customer_id.toString();
    const response = await axios.get(url);
    const account = response.data;
    return "http://localhost:3000/activation/" + account.customer_id + "/" + account.hash;
}

module.exports = {
    signIn,
}