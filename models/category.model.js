const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Product = require('./product.model');
// Define model 
const Category = sequelize.define("Category", {
    category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    paranoid: true,
    initialAutoIncrement: 0,
});

Category.hasMany(Product, {
    foreignKey: "category_id"
})

module.exports = Category;