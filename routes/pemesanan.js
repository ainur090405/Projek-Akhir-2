const express = require('express');
const router = express.Router();
const db = require('../config/db'); // MySQL biasa (pakai createConnection atau createPool)

// INDEX
router.get('/', (req, res) => {
  db.query(`
    SELECT pk.*, u.username, k.nama_kendaraan, s.nama_supir
    FROM pemesanan_kendaraan pk
    JOIN users u ON pk.id_user = u.id
    JOIN data_kendaraan k ON pk.id_kendaraan = k.id_kendaraan
    JOIN data_supir s ON pk.id_supir = s.id_supir
  `, (err, rows) => {
    if (err) return res.send(err);
    res.render('pemesanan/index', { data: rows, messages: req.flash() });
  });
});

// FORM CREATE
router.get('/create', (req, res) => {
  db.query("SELECT * FROM users", (err, users) => {
    if (err) return res.send(err);
    db.query("SELECT * FROM data_kendaraan", (err, kendaraan) => {
      if (err) return res.send(err);
      db.query("SELECT * FROM data_supir WHERE status = 'aktif'", (err, supir) => {
        if (err) return res.send(err);
        res.render('pemesanan/create', { users, kendaraan, supir });
      });
    });
  });
});

// ACTION CREATE
router.post('/store', (req, res) => {
  const { id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan } = req.body;
  db.query(`
    INSERT INTO pemesanan_kendaraan (id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan], (err) => {
    if (err) return res.send(err);
    req.flash('success', 'Pemesanan berhasil ditambahkan!');
    res.redirect('/pemesanan');
  });
});

// FORM EDIT
router.get('/edit/:id', (req, res) => {
  db.query("SELECT * FROM pemesanan_kendaraan WHERE id_pemesanan = ?", [req.params.id], (err, pemesanan) => {
    if (err) return res.send(err);
    db.query("SELECT * FROM users", (err, users) => {
      if (err) return res.send(err);
      db.query("SELECT * FROM data_kendaraan", (err, kendaraan) => {
        if (err) return res.send(err);
        db.query("SELECT * FROM data_supir WHERE status = 'aktif'", (err, supir) => {
          if (err) return res.send(err);
          res.render('pemesanan/edit', { data: pemesanan[0], users, kendaraan, supir });
        });
      });
    });
  });
});

// ACTION UPDATE
router.post('/update/:id', (req, res) => {
  const { id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan } = req.body;
  db.query(`
    UPDATE pemesanan_kendaraan
    SET id_user=?, id_kendaraan=?, id_supir=?, tanggal=?, waktu_mulai=?, waktu_selesai=?, status=?, keterangan=?
    WHERE id_pemesanan=?
  `, [id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan, req.params.id], (err) => {
    if (err) return res.send(err);
    req.flash('success', 'Pemesanan berhasil diperbarui!');
    res.redirect('/pemesanan');
  });
});

// ACTION DELETE
router.get('/hapus/:id', (req, res) => {
  db.query("DELETE FROM pemesanan_kendaraan WHERE id_pemesanan = ?", [req.params.id], (err) => {
    if (err) return res.send(err);
    req.flash('success', 'Pemesanan berhasil dihapus!');
    res.redirect('/pemesanan');
  });
});

module.exports = router;
