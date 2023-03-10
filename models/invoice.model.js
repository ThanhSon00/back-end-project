const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const { Sequelize } = require('sequelize');
const Invoice = sequelize.define("Invoice", {
    invoice_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
    paranoid: true,
});

module.exports = Invoice;