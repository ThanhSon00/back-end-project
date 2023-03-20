const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { api } = require('../bin/URL');

const renderPage = async (req, res) => {
    if (!req.query.price) {
        req.query.price = ['', ''];
    }
    const category_id = req.query.category_id || '';
    const pageSize = 9;
    const minPrice = req.query.price[0] || '';
    const maxPrice = req.query.price[1] || '';
    const page = req.query.page || 1;
    const response = await api.get(`/products?page=${page}&pageSize=${pageSize}&category_id=${category_id}&price=${minPrice}&price=${maxPrice}`)
    const { rows, count } = response.data;
    const categories = (await api.get('categories')).data;
    const totalPage = Math.floor(count / pageSize) + 1;     
    const customer = await getCurrentCustomer(req.cookies.access_token);
    const cart = (await getRelatedResource(customer, 'cart'))
    const cartProducts = (await getRelatedResource(cart, 'product')).Products;
    let relativePath = '/store?';
    if (category_id) {
        relativePath += `&category_id=${category_id}`;
    }
    if (minPrice) {
        relativePath += `&price=${minPrice}`;
    }
    if (maxPrice) {
        relativePath += `&price=${maxPrice}`;
    }
    if (page) {
        relativePath += `&page=${page}`;
    }    
    const pageFilteringPath = relativePath.replace(`&page=${page}`, '');
    const categoryFilteringPath = relativePath
        .replace(`&page=${page}`,'')
        .replace(`&category_id=${category_id}`, '');
    const priceFilteringPath = relativePath
        .replace(`&page=${page}`,'')
        .replace(`&price=${minPrice}`, '')
        .replace(`&price=${maxPrice}`, '');
        
    return res.render('store', {
        products: rows,
        prevPageNumber: page - 1,
        activePageNumber: page,
        nextPageNumber: parseInt(page) + 1,
        productAmount: count,
        totalPage,
        categories,
        relativePath,
        category_id,
        minPrice,
        maxPrice,
        pageFilteringPath,
        categoryFilteringPath,
        priceFilteringPath,
        cart,
        cartProducts,
    });
}

const getCurrentCustomer = async (token) => {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const customer_id = data.customer_id; 
    const response = await api.get(`/customers/${customer_id}`);
    return response.data;
}

const getRelatedResource = async (parentResource, rel) => {
    const link = parentResource._links.find((link) => link.rel == rel);
    const response = await api({
        method: link.method,
        url: link.href,
    })
    return response.data;
}

const addProductToCart = async (req, res) => {
    const data = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);
    const customer_id = data.customer_id;
    const cart = (await api.get(`/customers/${customer_id}/carts`)).data;
    const cart_id = cart.cart_id;
    const { product_id } = req.body;
    const amount = req.body.amount || 1;
    // Api need 2 keys which are customer_id and cart_id
    const cartProduct = await api.post(`/carts/${cart_id}/products`, {
        cart_id: cart_id,
        product_id: product_id,
        amount: amount,    
    });
    const cartProductObject = JSON.stringify(cartProduct.data);
    res.status(StatusCodes.OK).json(cartProductObject);
}

module.exports = {
    renderPage,
    addProductToCart
}