const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

const Invoice = sequelize.define("Invoice", {
    invoice_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    totalMoney: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
}, {
    initialAutoIncrement: 0,
    paranoid: true,
});

module.exports = Invoice;