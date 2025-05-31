const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/create/:id', (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Silakan login untuk memesan kendaraan.');
    return res.redirect('/login');
  }

  const kendaraanId = req.params.id;

  const kendaraanQuery = `
    SELECT dk.*, kk.nama_kategori 
    FROM data_kendaraan dk 
    JOIN kategori_kendaraan kk ON dk.id_kategori = kk.id_kategori 
    WHERE dk.id_kendaraan = ?
  `;

  db.query(kendaraanQuery, [kendaraanId], (err, kendaraanResults) => {
    if (err) {
      console.error('Query kendaraan error:', err);
      return res.render('pesanan/form', {
        error: 'Terjadi kesalahan saat memuat data kendaraan',
        kendaraan: null,
        supirList: [],
        user: req.session.user
      });
    }

    if (kendaraanResults.length === 0) {
      return res.render('pesanan/form', {
        error: 'Kendaraan tidak ditemukan',
        kendaraan: null,
        supirList: [],
        user: req.session.user
      });
    }

    const kendaraan = kendaraanResults[0];

    db.query(`SELECT * FROM data_supir WHERE status = 'aktif'`, (err, supirList) => {
      if (err) {
        console.error('Query supir error:', err);
        return res.render('pesanan/form', {
          error: 'Terjadi kesalahan saat memuat data supir',
          kendaraan,
          supirList: [],
          user: req.session.user
        });
      }

      res.render('pesanan/form', {
        kendaraan,
        supirList,
        error: null,
        user: req.session.user
      });
    });
  });
});
// Simpan pesanan
router.post('/store', (req, res) => {
  const {
    id_kendaraan,
    id_user,
    id_supir,
    tanggal,
    waktu_mulai,
    waktu_selesai,
    keterangan
  } = req.body;

  const insertQuery = `
    INSERT INTO pemesanan_kendaraan (
      id_kendaraan, id_user, id_supir, tanggal, waktu_mulai, waktu_selesai, keterangan
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [
    id_kendaraan,
    id_user,
    id_supir,
    tanggal,
    waktu_mulai,
    waktu_selesai,
    keterangan
  ], (err, result) => {
    if (err) {
      console.error('Insert pesanan error:', err);
      return res.status(500).send('Gagal menyimpan pesanan. Pastikan tabel dan kolom sudah benar.');
    }

    res.render('pesanan/success');
  });
});

module.exports = router;
