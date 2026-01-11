-- Menggunakan database shopikuykuy
CREATE DATABASE IF NOT EXISTS shopikuykuy;
USE shopikuykuy;

CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Tabel 2: Admin (Dibuat duluan karena menjadi referensi FK)
CREATE TABLE IF NOT EXISTS Admin (
    ID_Admin INT AUTO_INCREMENT PRIMARY KEY,
    Nama_Admin VARCHAR(100),
    Username VARCHAR(50),
    Password VARCHAR(255)
);

-- Tabel 3: Kategori (Dibuat duluan karena menjadi referensi FK)
CREATE TABLE IF NOT EXISTS Kategori (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nama_Kategori VARCHAR(100)
);

-- Tabel 1: Produk (Utama)
CREATE TABLE IF NOT EXISTS Produk (
    ID_Produk INT AUTO_INCREMENT PRIMARY KEY,
    Nama_Produk VARCHAR(100),
    Harga INT,
    Deskripsi TEXT,
    Tanggal_Input DATE,
    Stok INT,
    ID_Admin INT,
    ID_Kategori INT,
    FOREIGN KEY (ID_Admin) REFERENCES Admin(ID_Admin) ON DELETE SET NULL,
    FOREIGN KEY (ID_Kategori) REFERENCES Kategori(ID) ON DELETE SET NULL
);

-- SEED DATA (Data Awal agar aplikasi bisa jalan)
INSERT INTO Admin (Nama_Admin, Username, Password) VALUES ('Super Admin', 'admin', 'admin123');
INSERT INTO Kategori (Nama_Kategori) VALUES ('Elektronik'), ('Pakaian'), ('Makanan');