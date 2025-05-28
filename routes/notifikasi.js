const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.redirect('/login');

  const sql = `
    SELECT 
      n.jenis,
      n.isi_pesan,
      n.status_baca,
      n.waktu_kirim,
      k.nama_kendaraan,
      p.tanggal,
      p.status AS status_pemesanan
    FROM notifikasi_pemesanan n
    JOIN pemesanan_kendaraan p ON n.id_pemesanan = p.id_pemesanan
    JOIN data_kendaraan k ON p.id_kendaraan = k.id_kendaraan
    WHERE n.id_user = ?
    ORDER BY n.waktu_kirim DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).send('Gagal mengambil data notifikasi');
    res.render('notifikasi', { notifikasi: rows });
  });
});

module.exports = router;
