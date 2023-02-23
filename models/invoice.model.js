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
    },
    totalMoney: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
},
{
    initialAutoIncrement: 0,
    timestamps: false,
});

module.exports = Invoice;