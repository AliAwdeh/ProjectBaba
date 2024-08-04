// dbconnect.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'mak',
  password: 'rootstartx'
});

module.exports = pool;
