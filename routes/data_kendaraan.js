const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 GET semua kendaraan + nama kategori
router.get('/', (req, res) => {
  const sql = `
    SELECT k.*, c.nama_kategori 
    FROM data_kendaraan k
    JOIN kategori_kendaraan c ON k.id_kategori = c.id_kategori
  `;
  db.query(sql, (err, result) => {
    if (err) {
      req.flash('error', 'Terjadi kesalahan saat mengambil data');
      return res.redirect('/');
    }

    res.render('data_kendaraan/index', {
      kendaraan: result,
      messages: req.flash()
    });
  });
});

// 🔹 GET form tambah kendaraan
router.get('/create', (req, res) => {
  const sql = 'SELECT * FROM kategori_kendaraan';
  db.query(sql, (err, kategori) => {
    if (err) return res.status(500).send('Gagal ambil data kategori');
    res.render('data_kendaraan/create', { kategori });
  });
});

// 🔹 POST simpan kendaraan
router.post('/create', (req, res) => {
  const { nama_kendaraan, deskripsi, lokasi, gambar, id_kategori } = req.body;
  const data = { nama_kendaraan, deskripsi, lokasi, gambar, id_kategori };
  const sql = 'INSERT INTO data_kendaraan SET ?';
  db.query(sql, data, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal simpan kendaraan');
    }
    res.redirect('/data_kendaraan');
  });
});

// 🔹 GET form edit kendaraan
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const sqlKendaraan = 'SELECT * FROM data_kendaraan WHERE id_kendaraan = ?';
  const sqlKategori = 'SELECT * FROM kategori_kendaraan';

  db.query(sqlKendaraan, [id], (err, kendaraan) => {
    if (err || kendaraan.length === 0) {
      return res.status(404).send('Kendaraan tidak ditemukan');
    }

    db.query(sqlKategori, (err2, kategori) => {
      if (err2) return res.status(500).send('Gagal ambil kategori');
      res.render('data_kendaraan/edit', {
        kendaraan: kendaraan[0],
        kategori
      });
    });
  });
});

// 🔹 POST update kendaraan
router.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { nama_kendaraan, deskripsi, lokasi, gambar, id_kategori } = req.body;
  const sql = `
    UPDATE data_kendaraan 
    SET nama_kendaraan = ?, deskripsi = ?, lokasi = ?, gambar = ?, id_kategori = ?
    WHERE id_kendaraan = ?
  `;
  db.query(sql, [nama_kendaraan, deskripsi, lokasi, gambar, id_kategori, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal update kendaraan');
    }
    res.redirect('/data_kendaraan');
  });
});

// 🔹 GET hapus kendaraan
router.get('/hapus/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM data_kendaraan WHERE id_kendaraan = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Gagal hapus kendaraan:', err);
      return res.status(500).send('Gagal hapus kendaraan');
    }
    res.redirect('/data_kendaraan');
  });
});

module.exports = router;
