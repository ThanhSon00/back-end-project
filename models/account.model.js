const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
// Define model 
const Account = sequelize.define("Account", {
    customer_id: {
        primaryKey: true,
        autoIncrement: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
},
{
    initialAutoIncrement: 0,
    paranoid : true,
});

module.exports = Account;