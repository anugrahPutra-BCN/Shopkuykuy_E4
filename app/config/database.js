// app/config/database.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'db', // HARUS SAMA dengan nama service di docker-compose
    user: 'user',
    password: 'password',
    database: 'shopikuykuy'
});

module.exports = db;