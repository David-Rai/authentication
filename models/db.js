const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  queueLimit: 0,
  connectionLimit: 100,
  waitForConnections: true,
  multipleStatements: true
}).promise();

module.exports = pool;