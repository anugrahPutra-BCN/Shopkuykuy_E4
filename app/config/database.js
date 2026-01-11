const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', // Gunakan IP ini, bukan 'localhost'
    port: 3306,        // Port MySQL standar Anda
    user: 'root',
    password: '',      // Pastikan kosong jika di XAMPP tidak diset password
    database: 'shopikuykuy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();