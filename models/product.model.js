const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

const Product = sequelize.define("Product", {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    image: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.DOUBLE,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
},
{
    timestamps: false,
});

module.exports = Product;