const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/database');

const app = express();

// Konfigurasi Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'shopikuykuy_pink_secret',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Import rute produk Anda (asumsikan namanya productRoutes.js)
const productRoutes = require('./routes/productRoutes');
app.use('/', productRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));

const checkAuth = (req, res, next) => {
    if (req.session.isAdmin) return next();
    res.redirect('/login');
};

// --- ROUTES AUTHENTICATION ---
app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            req.session.isAdmin = true;
            res.redirect('/');
        } else {
            res.render('login', { error: 'Username atau Password salah!' });
        }
    } catch (err) { res.status(500).send("Database Error"); }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// --- ROUTES DASHBOARD ---
app.get('/', checkAuth, async (req, res) => {
    const search = req.query.search || '';
    try {
        // Ambil data produk & kategori sekaligus
        const [products] = await db.query(
            "SELECT *, (harga * stok) AS total_nilai FROM produk WHERE nama_produk LIKE ?", 
            [`%${search}%`]
        );
        const [categories] = await db.query("SELECT * FROM kategori");

        res.render('index', { products, categories, search });
    } catch (err) { res.status(500).send("Gagal memuat dashboard"); }
});

// Perbaikan Rute: POST /add agar sesuai dengan form
app.post('/add', checkAuth, async (req, res) => {
    const { nama_produk, id_kategori, harga, stok, deskripsi } = req.body;
    try {
        await db.query(
            'INSERT INTO produk (nama_produk, id_kategori, harga, stok, deskripsi) VALUES (?, ?, ?, ?, ?)',
            [nama_produk, id_kategori, harga, stok, deskripsi]
        );
        res.redirect('/');
    } catch (err) { res.status(500).send("Gagal menambah produk"); }
});

// Update Produk
app.post('/update/:id', checkAuth, async (req, res) => {
    const { nama_produk, id_kategori, harga, stok, deskripsi } = req.body;
    try {
        await db.query(
            'UPDATE produk SET nama_produk=?, id_kategori=?, harga=?, stok=?, deskripsi=? WHERE id_produk=?',
            [nama_produk, id_kategori, harga, stok, deskripsi, req.params.id]
        );
        res.redirect('/');
    } catch (err) { res.status(500).send("Gagal update produk"); }
});

// Hapus Produk
app.get('/delete/:id', checkAuth, async (req, res) => {
    try {
        await db.query('DELETE FROM produk WHERE id_produk = ?', [req.params.id]);
        res.redirect('/');
    } catch (err) { res.status(500).send("Gagal menghapus"); }
});

app.listen(3000, () => console.log('ShopiKuyKuy dashboard running on port 3000'));