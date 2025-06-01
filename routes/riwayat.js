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

  const queryNotif = `
    SELECT * FROM notifikasi_pemesanan
    WHERE id_user = ?
    ORDER BY waktu_kirim DESC
  `;

  db.query(queryRiwayat, [idUser], (err, riwayat) => {
    if (err) {
      console.error(err);
      return res.render('riwayat', { riwayat: [], notifikasi: [] });
    }

    db.query(queryNotif, [idUser], (err2, notifikasi) => {
      if (err2) {
        console.error(err2);
        return res.render('riwayat', { riwayat: riwayat, notifikasi: [] });
      }

      res.render('riwayat', { riwayat, notifikasi });
    });
  });
});
module.exports = router;
