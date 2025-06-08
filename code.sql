CREATE DATABASE travel_mobil;
USE travel_mobil;

-- Tabel users
CREATE TABLE users (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'user') DEFAULT 'user'
);

-- Tabel kategori_kendaraan
CREATE TABLE kategori_kendaraan (
    id_kategori INT(11) PRIMARY KEY AUTO_INCREMENT,
    nama_kategori VARCHAR(100) NOT NULL,
    deskripsi VARCHAR(255),
    gambar VARCHAR(255)
);

-- Tabel data_kendaraan
CREATE TABLE data_kendaraan (
    id_kendaraan INT(11) PRIMARY KEY AUTO_INCREMENT,
    nama_kendaraan VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    lokasi VARCHAR(100),
    gambar VARCHAR(255),
    id_kategori INT(11),
    FOREIGN KEY (id_kategori) REFERENCES kategori_kendaraan(id_kategori) ON DELETE CASCADE
);

-- Tabel data_supir
CREATE TABLE data_supir (
    id_supir INT(11) PRIMARY KEY AUTO_INCREMENT,
    nama_supir VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20),
    alamat TEXT,
    status ENUM('aktif', 'tidak_aktif') DEFAULT 'aktif'
);

-- Tabel jadwal_operasional_kendaraan
CREATE TABLE jadwal_operasional_kendaraan (
    id_jadwal INT(11) PRIMARY KEY AUTO_INCREMENT,
    id_kendaraan INT(11),
    hari ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
    jam_buka TIME,
    jam_tutup TIME,
    FOREIGN KEY (id_kendaraan) REFERENCES data_kendaraan(id_kendaraan) ON DELETE CASCADE
);

-- Tabel pemesanan_kendaraan
CREATE TABLE pemesanan_kendaraan (
    id_pemesanan INT(11) PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11),
    id_kendaraan INT(11),
    id_supir INT(11),
    tanggal DATE,
    waktu_mulai TIME,
    waktu_selesai TIME,
    status ENUM('menunggu', 'disetujui', 'ditolak') DEFAULT 'menunggu',
    keterangan TEXT,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_kendaraan) REFERENCES data_kendaraan(id_kendaraan),
    FOREIGN KEY (id_supir) REFERENCES data_supir(id_supir)
);

-- Tabel ulasan_kendaraan
CREATE TABLE ulasan_kendaraan (
    id_ulasan INT(11) PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11),
    id_kendaraan INT(11),
    rating INT(1),
    komentar TEXT,
    tanggal DATE,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_kendaraan) REFERENCES data_kendaraan(id_kendaraan)
);

-- Tabel log_aktivitas_pengguna
CREATE TABLE log_aktivitas_pengguna (
    id_log INT(11) PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11),
    aktivitas VARCHAR(255),
    waktu DATETIME,
    FOREIGN KEY (id_user) REFERENCES users(id)
);

isinya

-- Tabel: kategori_kendaraan
INSERT INTO kategori_kendaraan (id_kategori, nama_kategori, deskripsi, gambar) VALUES
(1, 'SUV', 'Mobil keluarga dengan kapasitas besar', 'suv.jpg'),
(2, 'Sedan', 'Mobil pribadi untuk penggunaan harian', 'sedan.jpg'),
(3, 'Minibus', 'Cocok untuk perjalanan bersama kelompok', 'minibus.jpg'),
(4, 'Pickup', NULL, 'pickup.jpg');

-- Tabel: data_kendaraan
INSERT INTO data_kendaraan (id_kendaraan, nama_kendaraan, deskripsi, lokasi, gambar, id_kategori) VALUES
(1, 'Toyota Innova', 'Mobil MPV nyaman untuk keluarga yang nyaman', 'Jakarta', 'innova.jpg', 3),
(2, 'Honda Civic', 'Sedan elegan dan bertenaga', 'Bandung', 'civic.jpg', 2),
(3, 'Isuzu Elf', 'Minibus untuk rombongan', 'Yogyakarta', 'elf.jpg', 3),
(5, 'Mitsubishi Pajero', 'SUV untuk perjalanan yang nyaman', 'Semarang', 'pajero.jpg', 1),
(11, 'Toyota Fortuner', 'SUV tangguh dan stylish', 'Jakarta', 'fortuner.jpg', 1),
(12, 'Honda Jazz', 'Hatchback sporty dan irit bahan bakar', 'Bandung', 'jazz.jpg', 2),
(13, 'Isuzu Panther', 'SUV dengan tenaga besar dan nyaman', 'Yogyakarta', 'panther.jpg', 1),
(14, 'Suzuki Ertiga', 'MPV compact dan ekonomis', 'Surabaya', 'ertiga.jpg', 1),
(15, 'Mitsubishi Triton', 'Pick-up tangguh untuk kerja', 'Semarang', 'triton.jpg', 4),
(16, 'Daihatsu Xenia', 'MPV hemat bahan bakar', 'Jakarta', 'xenia.jpg', 1),
(17, 'Nissan Grand Livina', 'MPV luas dan nyaman', 'Bandung', 'grandlivina.jpg', 1),
(18, 'Honda CR-V', 'SUV modern dengan fitur lengkap', 'Surabaya', 'crv.jpg', 1),
(20, 'Mitsubishi Outlander', 'SUV dengan teknologi canggih', 'Semarang', 'outlander.jpg', 1),
(21, 'Suzuki APV', 'Minibus serbaguna', 'Jakarta', 'apv.jpg', 3),
(22, 'Isuzu Giga', 'Truk berat untuk angkutan barang', 'Bandung', 'giga.jpg', 4),
(23, 'Toyota HiAce', 'Minibus luas dan nyaman', 'Yogyakarta', 'hiace.jpg', 3),
(24, 'Honda Brio', 'City car kecil dan gesit', 'Surabaya', 'brio.jpg', 2),
(25, 'Mitsubishi L300', 'Pick-up niaga populer', 'Semarang', 'l300.jpg', 4),
(26, 'Toyota Rush', 'SUV compact untuk kota dan offroad', 'Jakarta', 'rush.jpg', 1),
(27, 'Nissan X-Trail', 'SUV stylish dan nyaman', 'Bandung', 'xtrail.jpg', 1),
(28, 'Suzuki Swift', 'Hatchback sporty dan ringan', 'Yogyakarta', 'swift.jpg', 2),
(29, 'Toyota Mobilio', 'MPV kecil yang lincah', 'Surabaya', 'mobilio.jpg', 1),
(30, 'Luke', 'mobil minimalis dan nyaman', 'Serang', 'Luke.jpg', 1),
(32, 'Toyota Alphard', 'Mobil minibus mewah nyaman untuk keluarga', 'Sumenep', 'alphard.jpg', 3);

-- Tabel: data_supir
INSERT INTO data_supir (id_supir, nama_supir, no_hp, alamat, status) VALUES
(1, 'Ahmad Fauzi', '081234567890', 'Jl. Merdeka No.1, Jakarta', 'aktif'),
(2, 'Rudi Hartono', '082345678901', 'Jl. Sudirman No.2, Bandung', 'aktif'),
(3, 'Siti Aminah', '083456789012', 'Jl. Malioboro No.3, Yogyakarta', 'tidak_aktif'),
(4, 'Budi Santoso', '084567890123', 'Jl. Soekarno-Hatta No.4, Surabaya', 'aktif'),
(6, 'agus', '084579270220', 'pandan', 'tidak_aktif'),
(9, '0928340709', '0928340709', 'singkir', 'tidak_aktif'),
(10, 'Dewi Lestari', '085678901234', 'Jl. Pahlawan No.5, Semarang', 'aktif'),
(11, 'Joko Widodo', '08789012345', 'Jl. Gatot Subroto No.6, Jakarta', 'aktif'),
(12, 'Sri Mulyani', '087890123456', 'Jl. Diponegoro No.7, Bandung', 'tidak_aktif'),
(13, 'Agus Salim', '089010234567', 'Jl. Ahmad Yani No.8, Yogyakarta', 'aktif'),
(14, 'Rina Sari', '08122345678', 'Jl. Veteran No.9, Surabaya', 'aktif'),
(15, 'Hendra Gunawan', '0811234567890', 'Jl. Sudirman No.10, Semarang', 'aktif'),
(16, 'Nina Kurnia', '082234567890', 'Jl. Ciliwung No.11, Jakarta', 'aktif'),
(17, 'Toni Saputra', '083345678901', 'Jl. Gajah Mada No.12, Bandung', 'aktif'),
(18, 'Wati Susanti', '084456789012', 'Jl. Jendral Sudirman No.13, Yogyakarta', 'aktif'),
(19, 'Bambang Setiawan', '085567890123', 'Jl. Ahmad Yani No.14, Surabaya', 'aktif'),
(20, 'Sari Dewi', '086678901234', 'Jl. Merdeka No.15, Semarang', 'aktif'),
(21, 'Rizky Pratama', '087789012345', 'Jl. Sisingamangaraja No.16, Jakarta', 'aktif'),
(22, 'Lina Marlina', '08890123456', 'Jl. Teuku Umar No.17, Bandung', 'tidak_aktif'),
(23, 'Eko Santoso', '089012345678', 'Jl. Ahmad Yani No.18, Yogyakarta', 'aktif'),
(24, 'Dian Permata', '081012345678', 'Jl. Sudirman No.19, Surabaya', 'aktif'),
(25, 'Slamet Riyadi', '08345678901', 'Jl. Pahlawan No.20, Semarang', 'aktif'),
(26, 'Novi Handayani', '081234567890', 'Jl. Gajah Mada No.21, Jakarta', 'aktif'),
(27, 'Yusuf Kurniawan', '08434567890', 'Jl. Jendral Sudirman No.22, Bandung', 'aktif'),
(28, 'Fitriani', '085456789012', 'Jl. Ahmad Yani No.23, Yogyakarta', 'tidak_aktif');

INSERT INTO jadwal_operasional_kendaraan (id_jadwal, id_kendaraan, hari, jam_buka, jam_tutup) VALUES
(10,1,'Senin','07:00:00','17:00:00'),
(11,2,'Selasa','07:15:00','17:15:00'),
(12,3,'Rabu','07:30:00','17:30:00'),
(13,5,'Kamis','07:45:00','17:45:00'),
(14,11,'Jumat','08:00:00','18:00:00'),
(15,12,'Sabtu','08:15:00','18:15:00'),
(16,13,'Minggu','08:30:00','18:30:00'),
(17,14,'Senin','08:45:00','18:45:00'),
(18,15,'Selasa','09:00:00','19:00:00'),
(19,17,'Kamis','09:30:00','19:30:00'),
(20,19,'Jumat','09:45:00','19:45:00'),
(21,20,'Sabtu','10:00:00','20:00:00'),
(22,21,'Minggu','10:15:00','20:15:00'),
(23,22,'Senin','10:30:00','20:30:00'),
(24,23,'Selasa','10:45:00','20:45:00'),
(25,24,'Rabu','11:00:00','21:00:00'),
(26,25,'Kamis','11:15:00','21:15:00'),
(27,26,'Jumat','11:30:00','21:30:00'),
(28,27,'Sabtu','11:45:00','21:45:00'),
(29,28,'Minggu','11:45:00','21:45:00'),
(30,29,'Senin','12:15:00','22:15:00'),
(31,30,'Selasa','12:30:00','22:30:00'),
(32,31,'Selasa','12:45:00','20:00:00');

INSERT INTO log_aktivitas (id_log, id_user, aktivitas, waktu) VALUES
(1,2,'Login ke sistem','2025-05-20 01:00:00'),
(2,3,'Login ke sistem','2025-05-21 09:00:00'),
(3,4,'Memberikan ulasan kendaraan','2025-05-21 03:00:00'),
(4,8,'admin','2025-05-28 20:10:00');

INSERT INTO pesanan (id_pemesanan, id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan) VALUES
(5,1,2,1,'2009-07-31','20:43:00','23:56:00','disetujui','senang'),
(10,8,12,1,'2025-05-31','13:12:00','13:03:00','ditolak','jalan ke jombang'),
(21,8,4,2,'2025-05-30','09:04:00','09:07:00','disetujui','iqball'),
(28,8,11,20,'2025-06-01','03:30:00','03:38:00','disetujui','INI BANG GUE MAU PESAN YA BUAT ACARA KELUARGA'),
(29,8,30,8,'2025-08-03','09:00:00','10:00:00','ditolak',''),
(32,8,27,3,'2025-06-04','07:30:00','07:43:00','ditolak','mau ke jakarta ya'),
(33,13,19,12,'2025-06-03','04:06:00','09:08:00','ditolak','acara ke luar kota'),
(34,8,19,20,'2025-06-03','06:54:00','08:07:00','disetujui','acara');

INSERT INTO ulasan_kendaraan (id_ulasan, id_user, id_kendaraan, rating, komentar, tanggal) VALUES
(8,8,5,5,'bagus banget','2025-08-02'),
(9,13,13,5,'pelayanan bagus(contoh)','2025-08-04'),
(10,8,19,4,'bagus,rapi dan nyaman','2025-08-04');

INSERT INTO users (id, username, password, email, role) VALUES
(1, 'admin1', 'admin123', 'admin1@email.com', 'admin'),
(2, 'pengguna1', 'pass123', 'user1@email.com', 'user'),
(3, 'pengguna2', 'pass456', 'user2@email.com', 'user'),
(5, 'admin2', 'admin456', 'admin2@email.com', 'admin'),
(8, 'ainur', '111', 'ainur@gmail.com', 'admin'),
(13, 'erna', '111', 'ernamoh6f7@gmail.com', 'user');
