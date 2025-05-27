const express = require('express');
const router = express.Router();
const db = require('../config/db');

// INDEX
router.get('/', (req, res) => {
  db.query(`
    SELECT l.*, u.username 
    FROM log_aktivitas_pengguna l 
    JOIN users u ON l.id_user = u.id
    ORDER BY l.waktu DESC
  `, (err, rows) => {
    if (err) return res.send(err);
    res.render('log_aktivitas/index', { data: rows, messages: req.flash() });
  });
});

// FORM CREATE
router.get('/create', (req, res) => {
  db.query("SELECT * FROM users", (err, users) => {
    if (err) return res.send(err);
    res.render('log_aktivitas/create', { users });
  });
});

// ACTION CREATE
router.post('/store', (req, res) => {
  const { id_user, aktivitas, waktu } = req.body;
  db.query(`
    INSERT INTO log_aktivitas_pengguna (id_user, aktivitas, waktu) 
    VALUES (?, ?, ?)
  `, [id_user, aktivitas, waktu], (err) => {
    if (err) return res.send(err);
    req.flash('success', 'Log aktivitas berhasil ditambahkan!');
    res.redirect('/log_aktivitas');
  });
});

// FORM EDIT
router.get('/edit/:id', (req, res) => {
  db.query("SELECT * FROM log_aktivitas_pengguna WHERE id_log = ?", [req.params.id], (err, log) => {
    if (err) return res.send(err);
    db.query("SELECT * FROM users", (err, users) => {
      if (err) return res.send(err);
      res.render('log_aktivitas/edit', { data: log[0], users });
    });
  });
});

// ACTION UPDATE
router.post('/update/:id', (req, res) => {
  const { id_user, aktivitas, waktu } = req.body;
  db.query(`
    UPDATE log_aktivitas_pengguna 
    SET id_user = ?, aktivitas = ?, waktu = ?
    WHERE id_log = ?
  `, [id_user, aktivitas, waktu, req.params.id], (err) => {
    if (err) return res.send(err);
    req.flash('success', 'Log aktivitas berhasil diperbarui!');
    res.redirect('/log_aktivitas');
  });
});

// ACTION DELETE
router.get('/hapus/:id', (req, res) => {
  db.query("DELETE FROM log_aktivitas_pengguna WHERE id_log = ?", [req.params.id], (err) => {
    if (err) return res.send(err);
    req.flash('success', 'Log aktivitas berhasil dihapus!');
    res.redirect('/log_aktivitas');
  });
});

module.exports = router;
