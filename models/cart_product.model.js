const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Cart = require('./cart.model');
const Product = require('./product.model');
const CartProducts = sequelize.define("Cart_Product", {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    paranoid: true,
});

Cart.belongsToMany(Product, { 
    through: CartProducts,
    foreignKey: "cart_id",
});
Product.belongsToMany(Cart, { 
    through: CartProducts, 
    foreignKey: "product_id",
});

module.exports = CartProducts;