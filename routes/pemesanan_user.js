const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isLoggedIn } = require('../middlewares/auth');

// Tampilkan index pemesanan kendaraan
router.get('/index', isLoggedIn, (req, res) => {
  const kendaraanQuery = 'SELECT * FROM data_kendaraan';
  const supirQuery = 'SELECT * FROM data_supir WHERE status = "aktif"';

  db.query(kendaraanQuery, (err, kendaraanRows) => {
    if (err) throw err;

    db.query(supirQuery, (err, supirRows) => {
      if (err) throw err;

      res.render('pesanan_user/index', {
        kendaraan: kendaraanRows,
        supir: supirRows,
        username: req.session.username
      });
    });
  });
});

// Proses simpan pesanan
router.post('/store', isLoggedIn, (req, res) => {
  const { id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, keterangan } = req.body;
  const id_user = req.session.userId;

  const data = {
    id_user,
    id_kendaraan,
    id_supir,
    tanggal,
    waktu_mulai,
    waktu_selesai,
    status: 'menunggu',
    keterangan
  };

  db.query('INSERT INTO pemesanan_kendaraan SET ?', data, (err) => {
    if (err) {
      console.error(err);
      return res.redirect('/pesanan-user/index?error=' + encodeURIComponent('Gagal memesan.'));
    }

    res.redirect('/pesanan-user?success=' + encodeURIComponent('Pemesanan berhasil dikirim.'));
  });
});

// Daftar pesanan user
router.get('/', isLoggedIn, (req, res) => {
  const userId = req.session.userId;

  const query = `
    SELECT pk.*, dk.nama_kendaraan, ds.nama_supir 
    FROM pemesanan_kendaraan pk
    JOIN data_kendaraan dk ON pk.id_kendaraan = dk.id_kendaraan
    JOIN data_supir ds ON pk.id_supir = ds.id_supir
    WHERE pk.id_user = ?
    ORDER BY pk.tanggal DESC
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) throw err;

    res.render('pesanan_user/index', {
      pesanan: rows,
      username: req.session.username
    });
  });
});

module.exports = router;
