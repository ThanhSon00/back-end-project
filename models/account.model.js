const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
// Define model 
const Account = sequelize.define("Account", {
    phoneNumber: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
},
{
    paranoid : true
});

module.exports = Account;