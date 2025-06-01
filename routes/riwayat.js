const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Sesuaikan dengan file koneksi MySQL kamu

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const idUser = req.session.user.id;

  const queryRiwayat = `
    SELECT 
      pk.id_pemesanan,
      pk.tanggal,
      pk.waktu_mulai,
      pk.waktu_selesai,
      pk.status,
      pk.keterangan,
      dk.nama_kendaraan,
      dk.lokasi,
      dk.gambar AS gambar_kendaraan,
      kk.nama_kategori,
      ds.nama_supir,
      ds.no_hp
    FROM pemesanan_kendaraan pk
    JOIN data_kendaraan dk ON pk.id_kendaraan = dk.id_kendaraan
    JOIN kategori_kendaraan kk ON dk.id_kategori = kk.id_kategori
    JOIN data_supir ds ON pk.id_supir = ds.id_supir
    WHERE pk.id_user = ?
    ORDER BY pk.tanggal DESC
  `;

  db.query(queryRiwayat, [idUser], (err, riwayat) => {
    if (err) {
      console.error(err);
      return res.render('riwayat', { riwayat: [] });
    }

    res.render('riwayat', { riwayat });
  });
});

module.exports = router;
