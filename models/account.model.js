const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
// Define model 
const Account = sequelize.define("Account", {
    customer_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
    isNotActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
}, {
    paranoid: true,
});


// Hook
Account.beforeCreate(async (account, options) => {
    const password = account.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    account.password = hash;
});

Account.beforeBulkUpdate(async (account, options) => {
    if (account.attributes.password) {
        const password = account.attributes.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        account.attributes.password = hash;
    }
});

module.exports = Account;