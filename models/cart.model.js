const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

// Define model
const Cart = sequelize.define("Cart", {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: false,
});

module.exports = Cart;