// const { Sequelize } = require('sequelize');


// const DATABASE_HOST = 'localhost';
// const DATABASE_USER = 'root';
// const DATABASE_PASSWORD = 'radars_db';
// const DATABASE_PORT= '3306';
// const DATABASE = 'radars_db';

export default {
    development: {
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      host: process.env.DATABASE_HOST,
      dialect: 'mysql',
      port: process.env.DATABASE_PORT,
    },
  }