const { DataTypes, DOUBLE } = require('sequelize');
const sequelize = require('../database/connect');
const Invoice = require('./invoice.model');
const Product = require('./product.model');
const InvoiceProducts = sequelize.define("Invoice_Products", {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    money: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        allowNull: false,
    }
}, {
    paranoid: true,
});

Invoice.belongsToMany(Product, {
    through: InvoiceProducts,
    foreignKey: "invoice_id",
});
Product.belongsToMany(Invoice, {
    through: InvoiceProducts,
    foreignKey: "product_id",
});

module.exports = InvoiceProducts;                         