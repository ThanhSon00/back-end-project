const models = require('../models/models');
const sequelize = require('./connect');

sequelize.sync({ force: true })
  .then(() => {
    console.log('All models synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to sync models:', err);
  });