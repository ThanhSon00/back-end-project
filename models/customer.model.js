const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Account = require('./account.model');
const Cart = require('./cart.model');
const Invoice = require("./invoice.model")

// Define model
const Customer = sequelize.define("Customer", {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    money: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    initialAutoIncrement: 0,
    paranoid: true,
});

// Relationship
Customer.hasOne(Account, {
    foreignKey: "customer_id",
});

Customer.hasOne(Cart, {
    foreignKey: "customer_id",
});

Customer.hasMany(Invoice, {
    foreignKey: "customer_id"
})

module.exports = Customer;