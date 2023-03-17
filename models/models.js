const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

const Cart = sequelize.define("Cart", {
    cart_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    customer_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
}, {
    timestamps: false,
});

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

const Customer = sequelize.define("Customer", {
    customer_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    money: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    paranoid: true,
    individualHook: true,
});

const CartProduct = sequelize.define("Cart_Product", {
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    }
}, {
    timestamps: false,
});

const InvoiceProduct = sequelize.define("Invoice_Products", {
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

const Invoice = sequelize.define("Invoice", {
    invoice_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    totalMoney: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
}, {
    paranoid: true,
});

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

// Associations

Cart.belongsToMany(Product, {
    through: CartProduct,
    foreignKey: "cart_id",
});

Product.belongsToMany(Cart, {
    through: CartProduct,
    foreignKey: "product_id",
});

Customer.hasOne(Account, {
    foreignKey: "customer_id",
});

Customer.hasOne(Cart, {
    foreignKey: "customer_id",
});

Customer.hasMany(Invoice, {
    foreignKey: "customer_id"
});

Invoice.belongsToMany(Product, {
    through: InvoiceProduct,
    foreignKey: "invoice_id",
});
Product.belongsToMany(Invoice, {
    through: InvoiceProduct,
    foreignKey: "product_id",
});

Category.hasMany(Product, {
    foreignKey: "category_id"
})

module.exports = {
    Account,
    Cart,
    Product,
    Customer,
    Invoice,
    Category,
    InvoiceProduct,
    CartProduct,
}