const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Invoice = require('./invoice.model');
const Product = require('./product.model');
const InvoiceProducts = sequelize.define("Invoice_Products", {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
},
{
    timestamps: false,
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