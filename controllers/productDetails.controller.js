const { api } = require('../bin/URL');

const {
    getRelatedResource,
} = require('./store.controller')

const renderPage = async (req, res) => {
    const { product_id } = req.params;
    const { customer_id } = req.body;
    const customer = await api.get(`/customers/${customer_id}`);
    const cart = await getRelatedResource(customer, 'cart')
    const cartProducts = await getRelatedResource(cart, 'product');
    const productDetails = (await api.get(`/products/${product_id}/details`)).data;
    const productImages = productDetails.image.replaceAll('US40', 'SX500').replaceAll('SX38_SY50_CR003850', 'SX500').split('|');
    const product = (await api.get(`/products/${product_id}`)).data;
    const random = randomIntFromInterval(1, 14);
    const relatedProducts = (await api.get(`/products?category_id=${product.category_id}&pageSize=4&page=${random}`)).data;
    const productCategory = (await api.get(`/products/${product_id}/categories`)).data;
    return res.render('product', {
        cart,
        cartProducts,
        productDetails,
        productImages,
        product,
        relatedProducts: relatedProducts.rows,
        productCategory,
    });
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

module.exports = {
    renderPage,
}