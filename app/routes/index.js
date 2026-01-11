const express = require('express');
const router = express.Router();
const db = require('../config/database');

// --- (R) READ: Tampilkan semua produk ---
router.get('/', async (req, res) => {
    try {
        // Query Join untuk mengambil Nama Kategori juga
        const [rows] = await db.query(`
            SELECT p.*, k.Nama_Kategori 
            FROM Produk p 
            LEFT JOIN Kategori k ON p.ID_Kategori = k.ID
        `);
        
        // Ambil data kategori untuk form tambah/edit
        const [categories] = await db.query('SELECT * FROM Kategori');
        
        res.render('index', { products: rows, categories: categories });
    } catch (err) {
        console.error(err);
        res.send("Error Database");
    }
});

// --- (C) CREATE: Tambah Produk ---
router.post('/add', async (req, res) => {
    const { nama_produk, harga, deskripsi, stok, id_kategori } = req.body;
    const tanggal_input = new Date();
    const id_admin = 1; // Default ke Admin ID 1 (Sesuai seed data)

    try {
        await db.query(
            `INSERT INTO Produk (Nama_Produk, Harga, Deskripsi, Tanggal_Input, Stok, ID_Admin, ID_Kategori) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nama_produk, harga, deskripsi, tanggal_input, stok, id_admin, id_kategori]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Gagal Menambah Data");
    }
});

// --- (U) UPDATE: Edit Produk ---
router.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { nama_produk, harga, deskripsi, stok, id_kategori } = req.body;

    try {
        await db.query(
            `UPDATE Produk 
             SET Nama_Produk=?, Harga=?, Deskripsi=?, Stok=?, ID_Kategori=? 
             WHERE ID_Produk=?`,
            [nama_produk, harga, deskripsi, stok, id_kategori, id]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Gagal Update Data");
    }
});

// --- (D) DELETE: Hapus Produk ---
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db.query('DELETE FROM Produk WHERE ID_Produk = ?', [id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Gagal Menghapus Data");
    }
});

module.exports = router;