const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

const Cart = sequelize.define("cart", {
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

const Product = sequelize.define("product", {
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

const Customer = sequelize.define("customer", {
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

const CartProduct = sequelize.define("cart_product", {
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    }
}, {
    timestamps: false,
});

const InvoiceProduct = sequelize.define("invoice_products", {
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

const Account = sequelize.define("account", {
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

const Invoice = sequelize.define("invoice", {
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

const Category = sequelize.define("category", {
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

const ProductDetail = sequelize.define("productdetail", {
    product_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    image: {
        type: DataTypes.TEXT,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    paranoid: true,
})

const Token = sequelize.define("token", {
    customer_id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    jti: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    expiration: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: false,
})


// Associations

Cart.belongsToMany(Product, {
    through: CartProduct,
    foreignKey: "cart_id",
});

Product.belongsToMany(Cart, {
    through: CartProduct,
    foreignKey: "product_id",
});

Product.hasOne(ProductDetail, {
    foreignKey: "product_id",
})

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

CartProduct.afterUpsert(async (instances, options) => {
    const cartProduct = instances[0].dataValues;
    const cart = await Cart.findOne({
        where: {
            cart_id: cartProduct.cart_id,
        }
    })
    const totalAmount = parseInt(cart.totalAmount);
    await Cart.update({
        totalAmount: parseInt(totalAmount) + parseInt(cartProduct.amount),
    }, {
        where: {
            cart_id: cartProduct.cart_id,
        }
    })
});

CartProduct.afterUpdate(async (instances, options) => {
    const newCartProduct = instances.dataValues;
    const oldCartProduct = instances._previousDataValues;
    const amountToChange = newCartProduct.amount - oldCartProduct.amount;
    const cart = await Cart.findOne({
        where: {
            cart_id: newCartProduct.cart_id,
        }
    })
    const totalAmount = parseInt(cart.totalAmount);
    await Cart.update({
        totalAmount: parseInt(totalAmount) + parseInt(amountToChange),
    }, {
        where: {
            cart_id: newCartProduct.cart_id,
        }
    })
});

CartProduct.afterDestroy(async (cartProduct, options) => {
    const cart = await Cart.findOne({
        where: {
            cart_id: cartProduct.cart_id
        }
    })
    const totalAmount = parseInt(cart.totalAmount);
    await Cart.update({
        totalAmount: totalAmount - cartProduct.amount,
    }, {
        where: {
            cart_id: cartProduct.cart_id
        }
    })
});

module.exports = {
    Account,
    Cart,
    Product,
    Customer,
    Invoice,
    Category,
    InvoiceProduct,
    CartProduct,
    ProductDetail,
    Token,
}