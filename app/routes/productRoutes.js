const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Middleware untuk proteksi halaman admin
const checkAuth = (req, res, next) => {
    if (req.session.isLoggedIn) return next();
    res.redirect('/login');
};

// --- AUTHENTICATION ---
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Sesuai SQL: Nama tabel 'Admin', kolom 'Username' dan 'Password' (Huruf Kapital Depan)
        const [rows] = await db.query(
            'SELECT * FROM Admin WHERE Username = ? AND Password = ?', 
            [username, password]
        );
        
        if (rows.length > 0) {
            req.session.isLoggedIn = true;
            req.session.adminId = rows[0].ID_Admin; // Ambil ID_Admin untuk referensi FK Produk
            res.redirect('/');
        } else {
            res.render('login', { error: 'Username atau Password salah! ❌' });
        }
    } catch (err) {
        console.error("Error Login:", err);
        res.status(500).send("Database Error");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// --- DASHBOARD PRODUK ---
router.get('/', checkAuth, async (req, res) => {
    try {
        // Query menggunakan JOIN sesuai nama kolom di SQL Anda
        const [rows] = await db.query(`
            SELECT p.*, k.Nama_Kategori 
            FROM Produk p 
            LEFT JOIN Kategori k ON p.ID_Kategori = k.ID
        `);
        const [categories] = await db.query('SELECT * FROM Kategori');
        res.render('index', { products: rows, categories: categories });
    } catch (err) {
        console.error("Error Load Dashboard:", err);
        res.status(500).send("Database Error");
    }
});

// --- TAMBAH PRODUK ---
router.post('/add', checkAuth, async (req, res) => {
    const { nama_produk, harga, deskripsi, stok, id_kategori } = req.body;
    const tanggal_input = new Date();
    
    try {
        // Memastikan Nama Kolom sesuai SQL (Nama_Produk, Harga, dll)
        await db.query(
            `INSERT INTO Produk (Nama_Produk, Harga, Deskripsi, Tanggal_Input, Stok, ID_Admin, ID_Kategori) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nama_produk, harga, deskripsi, tanggal_input, stok, req.session.adminId, id_kategori]
        );
        res.redirect('/');
    } catch (err) {
        console.error("Error Add Product:", err);
        res.status(500).send("Gagal Menambah Data");
    }
});

module.exports = router;