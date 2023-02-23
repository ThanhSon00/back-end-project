const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

// Define model
const Cart = sequelize.define("Cart", {
    cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    paranoid : true,
    initialAutoIncrement: 0,
});

module.exports = Cart;