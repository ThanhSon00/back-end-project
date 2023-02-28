const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const bcrypt = require('bcryptjs');
// Define model 
const Account = sequelize.define("Account", {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    hash: {
        type: DataTypes.TEXT,
    },
    isNotActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
},
{
    paranoid : true,
});


// Hook
Account.beforeCreate(async (account, options) => {
    const password = account.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    account.password = hash;
});


module.exports = Account;