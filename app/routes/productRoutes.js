// --- MIDDLEWARE CEK LOGIN ---
const isAdmin = (req, res, next) => {
    if (req.session.isLoggedIn) return next();
    res.redirect('/login');
};

// --- (R) LOGIN PAGE ---
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// --- LOGIKA LOGIN ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Query disesuaikan dengan tabel Admin di init.sql
        const [rows] = await db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password]);
        
        if (rows.length > 0) {
            req.session.isLoggedIn = true;
            req.session.adminId = rows[0].id;
            res.redirect('/');
        } else {
            res.render('login', { error: 'Username atau Password salah! ❌' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error saat Login");
    }
});

// --- LOGOUT ---
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// --- UPDATE RUTE UTAMA (Gunakan Middleware isAdmin) ---
router.get('/', isAdmin, async (req, res) => {
    try {
        // Gunakan LEFT JOIN agar kategori yang kosong tetap tampil
        const [rows] = await db.query(`
            SELECT p.*, k.nama_kategori 
            FROM produk p 
            LEFT JOIN kategori k ON p.id_kategori = k.id
        `);
        const [categories] = await db.query('SELECT * FROM kategori');
        res.render('index', { products: rows, categories: categories });
    } catch (err) {
        res.status(500).send("Database Error");
    }
});

// Pastikan rute POST /add sudah terdaftar di sini agar tidak "Cannot POST"
router.post('/add', isAdmin, async (req, res) => {
    const { nama_produk, harga, deskripsi, stok, id_kategori } = req.body;
    try {
        await db.query(
            `INSERT INTO produk (nama_produk, harga, deskripsi, stok, id_kategori) 
             VALUES (?, ?, ?, ?, ?)`,
            [nama_produk, harga, deskripsi, stok, id_kategori]
        );
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Gagal Menambah Data");
    }
});