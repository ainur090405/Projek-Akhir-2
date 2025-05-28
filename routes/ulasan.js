const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET: Tampilkan halaman ulasan dan form
router.get('/', (req, res) => {
const sqlUlasan = `
    SELECT u.*, users.username, dk.nama_kendaraan
    FROM ulasan_kendaraan u
    JOIN users ON u.id_user = users.id
    JOIN data_kendaraan dk ON u.id_kendaraan = dk.id_kendaraan
    ORDER BY u.tanggal DESC
  `;

  const sqlKendaraan = `SELECT id_kendaraan, nama_kendaraan FROM data_kendaraan`;

db.query(sqlUlasan, (err, ulasanResults) => {
if (err) {
console.error('Gagal ambil ulasan:', err);
req.flash('error', 'Gagal ambil data ulasan.');
return res.render('ulasan', {
ulasan: [],
kendaraan: [],
user: req.session.user,
success: req.flash('success'),
error: req.flash('error')
});
}
db.query(sqlKendaraan, (err2, kendaraanResults) => {
  if (err2) {
    console.error('Gagal ambil kendaraan:', err2);
    req.flash('error', 'Gagal ambil data kendaraan.');
    return res.render('ulasan', {
      ulasan: ulasanResults,
      kendaraan: [],
      user: req.session.user,
      success: req.flash('success'),
      error: req.flash('error')
    });
  }

  res.render('ulasan', {
    ulasan: ulasanResults,
    kendaraan: kendaraanResults,
    user: req.session.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
});
});
});

// POST: Kirim ulasan
router.post('/', (req, res) => {
const { id_kendaraan, rating, komentar } = req.body;

if (!req.session.user) {
req.flash('error', 'Silakan login dulu.');
return res.redirect('/login');
}

const id_user = req.session.user.id;

  const insertUlasan = `
    INSERT INTO ulasan_kendaraan (id_user, id_kendaraan, rating, komentar, tanggal)
    VALUES (?, ?, ?, ?, NOW())
  `;
db.query(insertUlasan, [id_user, id_kendaraan, rating, komentar], (err) => {
if (err) {
console.error('Gagal simpan ulasan:', err);
req.flash('error', 'Gagal kirim ulasan.');
} else {
req.flash('success', 'Ulasan berhasil dikirim!');
}
res.redirect('/ulasan');
});
});

module.exports = router;