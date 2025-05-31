const express = require('express');
const router = express.Router();
const conn = require('../config/db');

// READ
router.get('/', (req, res) => {
  conn.query(`
    SELECT n.*, u.username, p.id_pemesanan 
    FROM notifikasi_pemesanan n
    JOIN users u ON n.id_user = u.id
    JOIN pemesanan_kendaraan p ON n.id_pemesanan = p.id_pemesanan
    ORDER BY n.waktu_kirim DESC
  `, (err, rows) => {
    if (err) throw err;
    res.render('notifikasi_crud/index', { notifikasi: rows });
  });
});

// CREATE - form
router.get('/create', (req, res) => {
  conn.query("SELECT * FROM users", (err, users) => {
    conn.query("SELECT * FROM pemesanan_kendaraan", (err2, pemesanan) => {
      res.render('notifikasi_crud/create', { users, pemesanan });
    });
  });
});

// CREATE - action
router.post('/create', (req, res) => {
  const { id_user, id_pemesanan, isi_pesan, waktu_kirim, status_baca } = req.body;
  const sql = `INSERT INTO notifikasi_pemesanan (id_user, id_pemesanan, isi_pesan, waktu_kirim, status_baca) VALUES (?, ?, ?, ?, ?)`;
  conn.query(sql, [id_user, id_pemesanan, isi_pesan, waktu_kirim, status_baca], (err) => {
    if (err) throw err;
    res.redirect('/notifikasi_crud');
  });
});

// EDIT - form
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  conn.query("SELECT * FROM notifikasi_pemesanan WHERE id_notifikasi = ?", [id], (err, row) => {
    conn.query("SELECT * FROM users", (err2, users) => {
      conn.query("SELECT * FROM pemesanan_kendaraan", (err3, pemesanan) => {
        res.render('notifikasi_crud/edit', { data: row[0], users, pemesanan });
      });
    });
  });
});

// UPDATE - action
router.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { id_user, id_pemesanan, isi_pesan, waktu_kirim, status_baca } = req.body;
  const sql = `UPDATE notifikasi_pemesanan SET id_user=?, id_pemesanan=?, isi_pesan=?, waktu_kirim=?, status_baca=? WHERE id_notifikasi=?`;
  conn.query(sql, [id_user, id_pemesanan, isi_pesan, waktu_kirim, status_baca, id], (err) => {
    if (err) throw err;
    res.redirect('/notifikasi_crud');
  });
});

// DELETE
router.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  conn.query("DELETE FROM notifikasi_pemesanan WHERE id_notifikasi = ?", [id], (err) => {
    if (err) throw err;
    res.redirect('/notifikasi_crud');
  });
});

module.exports = router;
