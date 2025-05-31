const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET: Tampilkan halaman notifikasi
router.get('/', (req, res) => {
  if (!req.session.user) {
    // Jangan redirect, tapi tampilkan halaman dengan pesan error
    return res.render('notifikasi', {
      notifikasi: [],
      user: null,
      success: null,
      error: 'Silakan login terlebih dahulu.'
    });
  }

  const userId = req.session.user.id;

  const sql = `
    SELECT n.*, p.status AS status_pemesanan
    FROM notifikasi_pemesanan n
    JOIN pemesanan_kendaraan p ON n.id_pemesanan = p.id_pemesanan
    WHERE n.id_user = ?
    ORDER BY n.waktu_kirim DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Gagal mengambil notifikasi:', err);
      return res.render('notifikasi', {
        notifikasi: [],
        user: req.session.user,
        success: null,
        error: 'Gagal mengambil notifikasi.'
      });
    }

    res.render('notifikasi', {
      notifikasi: results,
      user: req.session.user,
      success: req.flash('success'),
      error: null
    });
  });
});

module.exports = router;
