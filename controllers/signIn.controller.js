const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const nodemailer = require('nodemailer')
const ejs = require('ejs');
const path = require('path');
const signIn = async (req, res, next) => {
    let url, response;
    const {
        email,
        password,
        phone,
        name,
        rewrite_password
    } = req.body;

    // Check all information filled
    if (email == '' || password == '' || phone == '' || name == '' || rewrite_password == '') {
        console.log('Please fill all the information');
        return res.status(StatusCodes.BAD_REQUEST).render('signIn', { 
            message: "Please fill all the information",
            email: email,
            phone: phone,
            name: name,
            password: password,
            rewrite_password: rewrite_password, });
    }
    // Check phone

    // Check email

    // Check passwords
    if (password != rewrite_password) {
        return res.status(StatusCodes.BAD_REQUEST).render('signIn', { 
            message: "Passwords are not matching",
            email: email,
            phone: phone,
            name: name, });
    }
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
    res.render('check-mail');
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

    ejs.renderFile(path.resolve("./views/verify-email.ejs"), {link: link}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: 'phanson999999@gmail.com',
                to: email,
                subject: "E-commerce: Verify your email",
                html: data
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    }); 
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