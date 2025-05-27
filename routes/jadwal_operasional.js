const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rute untuk menampilkan jadwal operasional
router.get('/', (req, res) => {
  const sql = `
    SELECT jo.id_jadwal, jo.hari, jo.jam_buka, jo.jam_tutup, dk.nama_kendaraan
    FROM jadwal_operasional_kendaraan jo
    JOIN data_kendaraan dk ON jo.id_kendaraan = dk.id_kendaraan
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render('jadwal_operasional', { jadwal: result });
  });
});

module.exports = router;
