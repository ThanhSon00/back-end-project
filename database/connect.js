const Sequelize = require('sequelize');
const sequelize = new Sequelize('sql12611726', 'sql12611726', 'NkEtZBBmhR', {
  host: 'sql12.freemysqlhosting.net',
  dialect: require('mysql2'),
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
