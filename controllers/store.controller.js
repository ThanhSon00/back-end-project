const storeController = async (req, res) => {
    let rows, count;

    if (!req.query.price) {
        req.query.price = ['', ''];
    }
    const action = req.query.action;
    const category_id = req.query.category_id || '';
    const pageSize = 9;
    const minPrice = req.query.price[0] || '';
    const maxPrice = req.query.price[1] || '';
    const page = req.query.page || 1;

    if (action == 'Filter') {
        page = 1;
    }
    const response = await api.get(`/products?page=${page}&pageSize=${pageSize}&category_id=${category_id}&price=${minPrice}&price=${maxPrice}`)
    rows = response.data.rows;
    count = response.data.count;
    const response1 = await api.get('categories');
    const totalPage = Math.floor(count / pageSize) + 1;
    
    let relativePath = '/store?';
    if (category_id) {
        relativePath += `&category_id=${category_id}`;
    }
    
    if (minPrice) {
        relativePath += `&price=gte:${minPrice}`;
    }
    
    if (maxPrice) {
        relativePath += `&price=lte:${maxPrice}`;
    }
    
    return res.render('store', {
        products: rows,
        prevPageNumber: page - 1,
        activePageNumber: page,
        nextPageNumber: parseInt(page) + 1,
        productAmount: count,
        totalPage: totalPage,
        categories: response1.data,
        relativePath,
        category_id,
        minPrice,
        maxPrice,
    });
}

module.exports = {
    storeController,
}