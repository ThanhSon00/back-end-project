const { DataTypes} = require('sequelize');
const sequelize = require('../database/connect');
const Account = require('./account.model');
const Cart = require('./cart.model');
const Invoice = require("./invoice.model")

// Define model
const Customer = sequelize.define("Customer", {
    phone: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    money: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
    },
},
{
    paranoid : true,
});

Customer.hasOne(Account, {
    foreignKey: "phoneNumber",
});

Customer.hasOne(Cart, {
    foreignKey: "customer_id",
});

Customer.hasMany(Invoice, {
    foreignKey: "customer_id"
})

module.exports = Customer;