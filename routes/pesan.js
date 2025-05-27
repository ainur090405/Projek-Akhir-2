const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/', (req, res) => {
  const userId = req.session.user?.id; // asumsikan pakai session untuk user login

  if (!userId) {
    return res.redirect('/login'); // redirect jika belum login
  }

  const sql = `
    SELECT n.*, u.username, p.id_pemesanan
    FROM notifikasi_pemesanan n
    JOIN users u ON u.id = n.id_user
    JOIN pemesanan_kendaraan p ON p.id_pemesanan = n.id_pemesanan
    WHERE n.id_user = ?
    ORDER BY n.waktu_kirim DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) throw err;
    res.render('pesan/index', { notifikasi: results });
  });
});

module.exports = router;
