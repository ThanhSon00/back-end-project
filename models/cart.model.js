const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const { Sequelize } = require('sequelize');
// Define model
const Cart = sequelize.define("Cart", {
    customer_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: false,
});

module.exports = Cart;