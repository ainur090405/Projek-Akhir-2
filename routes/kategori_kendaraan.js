const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 Tampilkan semua kategori
router.get('/', (req, res) => {
  db.query('SELECT * FROM kategori_kendaraan', (err, result) => {
    if (err) return res.status(500).send('Gagal ambil data');
    res.render('kategori_kendaraan/index', { data: result, messages: req.flash() });
  });
});

// 🔹 Form tambah kategori
router.get('/create', (req, res) => {
  res.render('kategori_kendaraan/create');
});

// 🔹 Simpan kategori baru
router.post('/create', (req, res) => {
  const { nama_kategori, deskripsi } = req.body;
  const sql = 'INSERT INTO kategori_kendaraan (nama_kategori, deskripsi) VALUES (?, ?)';
  db.query(sql, [nama_kategori, deskripsi], (err) => {
    if (err) {
      req.flash('error', 'Gagal menambah kategori');
      return res.redirect('/kategori_kendaraan');
    }
    req.flash('success', 'Kategori berhasil ditambahkan');
    res.redirect('/kategori_kendaraan');
  });
});

// 🔹 Form edit kategori
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM kategori_kendaraan WHERE id_kategori = ?', [id], (err, result) => {
    if (err || result.length === 0) return res.status(404).send('Data tidak ditemukan');
    res.render('kategori_kendaraan/edit', { kategori: result[0] });
  });
});

// 🔹 Update kategori
router.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { nama_kategori, deskripsi } = req.body;
  const sql = 'UPDATE kategori_kendaraan SET nama_kategori = ?, deskripsi = ? WHERE id_kategori = ?';
  db.query(sql, [nama_kategori, deskripsi, id], (err) => {
    if (err) {
      req.flash('error', 'Gagal mengubah kategori');
      return res.redirect('/kategori_kendaraan');
    }
    req.flash('success', 'Kategori berhasil diperbarui');
    res.redirect('/kategori_kendaraan');
  });
});

// 🔹 Hapus kategori
router.get('/hapus/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM kategori_kendaraan WHERE id_kategori = ?', [id], (err) => {
    if (err) {
      req.flash('error', 'Gagal menghapus kategori (mungkin masih digunakan)');
      return res.redirect('/kategori_kendaraan');
    }
    req.flash('success', 'Kategori berhasil dihapus');
    res.redirect('/kategori_kendaraan');
  });
});

module.exports = router;
