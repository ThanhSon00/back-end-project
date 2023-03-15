const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Sequelize = require('sequelize');
const Product = sequelize.define("Product", {
    product_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
}, {
    paranoid: true,
});

module.exports = Product;