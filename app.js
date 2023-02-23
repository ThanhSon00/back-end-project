const express = require('express');
const app = express();
const accountRoutes = require('./route/accountRoutes');
const customerRoutes = require('./route/customerRoutes');
const cartRoutes = require('./route/cartRoutes');
const productRoutes = require('./route/productRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/customer', customerRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/product', productRoutes);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
