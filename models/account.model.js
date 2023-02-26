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
},
{
    paranoid : true,
});


// Hook
Account.beforeCreate(async (account, options) => {
    const password = account.password;
    bcrypt.genSalt(10, async (err, Salt) => {
        bcrypt.hash(password, Salt, async (err, hash) => {
            account.password = hash;
        })
    })
})
module.exports = Account;