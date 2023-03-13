const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Sequelize = require('sequelize');
const Product = require('./product.model');
// Define model 
const Category = sequelize.define("Category", {
    category_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    paranoid: true,
});

Category.hasMany(Product, {
    foreignKey: "category_id"
})

module.exports = Category;