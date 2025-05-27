const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const sql = `
    SELECT k.*, c.nama_kategori 
    FROM data_kendaraan k 
    JOIN kategori_kendaraan c ON k.id_kategori = c.id_kategori
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send('Gagal ambil data kendaraan');
    res.render('kendaraan_user', { kendaraan: result });
  });
});

module.exports = router;
