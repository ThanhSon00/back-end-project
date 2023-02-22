const express = require('express');
const app = express();
const accountRoutes = require('./route/accountRoutes');
const customerRoutes = require('./route/customerRoutes');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/customer', customerRoutes);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
