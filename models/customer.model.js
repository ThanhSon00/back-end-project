const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const { Sequelize } = require('sequelize');
const Account = require('./account.model');
const Cart = require('./cart.model');
const Invoice = require("./invoice.model")
const uuid = require('uuid');
// Define model
const Customer = sequelize.define("Customer", {
    customer_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
    paranoid: true,
    individualHook: true,
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
});

module.exports = Customer;