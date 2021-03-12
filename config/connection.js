// import the Sequelize constructor from the library
// const Sequelize = require('sequelize');

// require('dotenv').config();

// // create connection to our database, pass in your MySQL info 
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306
// });

// module.exports = sequelize;

// let sequelize;
// // this will first connect to JAWSDB, or else connect to localhost
// if (process.env.JAWSDB_URL){
//     sequelize = new Sequelize(process.env.JAWSDB_URL);
// }else{
//     sequalize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW,{
//         host: 'localhost',
//         dialect: 'mysql2',
//         port: 3306
//     });
// }

const Sequelize = require('sequelize');

require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

module.exports = sequelize;
