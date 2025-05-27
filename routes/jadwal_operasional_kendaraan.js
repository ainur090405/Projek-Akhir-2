const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 GET semua jadwal
router.get('/', (req, res) => {
  const sql = `
    SELECT j.*, k.nama_kendaraan
    FROM jadwal_operasional_kendaraan j
    JOIN data_kendaraan k ON j.id_kendaraan = k.id_kendaraan
  `;
  db.query(sql, (err, data) => {
    if (err) {
      req.flash('error', 'Gagal mengambil data jadwal');
      return res.redirect('/');
    }
    res.render('jadwal/index', { data, messages: req.flash() });
  });
});

// 🔹 GET form tambah jadwal
router.get('/create', (req, res) => {
  db.query('SELECT * FROM data_kendaraan', (err, kendaraan) => {
    if (err) return res.status(500).send('Gagal ambil kendaraan');
    res.render('jadwal/create', { kendaraan });
  });
});

// 🔹 POST tambah jadwal
router.post('/create', (req, res) => {
  const { id_kendaraan, hari, jam_buka, jam_tutup } = req.body;
  const sql = 'INSERT INTO jadwal_operasional_kendaraan SET ?';
  const data = { id_kendaraan, hari, jam_buka, jam_tutup };

  db.query(sql, data, err => {
    if (err) {
      req.flash('error', 'Gagal menambah jadwal');
    } else {
      req.flash('success', 'Jadwal berhasil ditambahkan');
    }
    res.redirect('/jadwal_operasional_kendaraan');
  });
});

// 🔹 GET form edit jadwal
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const sql1 = 'SELECT * FROM jadwal_operasional_kendaraan WHERE id_jadwal = ?';
  const sql2 = 'SELECT * FROM data_kendaraan';

  db.query(sql1, [id], (err, jadwal) => {
    if (err || jadwal.length === 0) return res.status(404).send('Jadwal tidak ditemukan');
    db.query(sql2, (err2, kendaraan) => {
      if (err2) return res.status(500).send('Gagal ambil kendaraan');
      res.render('jadwal/edit', { jadwal: jadwal[0], kendaraan });
    });
  });
});

// 🔹 POST update jadwal
router.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { id_kendaraan, hari, jam_buka, jam_tutup } = req.body;
  const sql = `
    UPDATE jadwal_operasional_kendaraan 
    SET id_kendaraan = ?, hari = ?, jam_buka = ?, jam_tutup = ? 
    WHERE id_jadwal = ?
  `;
  db.query(sql, [id_kendaraan, hari, jam_buka, jam_tutup, id], err => {
    if (err) {
      req.flash('error', 'Gagal memperbarui jadwal');
    } else {
      req.flash('success', 'Jadwal berhasil diperbarui');
    }
    res.redirect('/jadwal_operasional_kendaraan');
  });
});

// 🔹 GET hapus jadwal
router.get('/hapus/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM jadwal_operasional_kendaraan WHERE id_jadwal = ?', [id], err => {
    if (err) {
      req.flash('error', 'Gagal menghapus jadwal');
    } else {
      req.flash('success', 'Jadwal berhasil dihapus');
    }
    res.redirect('/jadwal_operasional_kendaraan');
  });
});

module.exports = router;
