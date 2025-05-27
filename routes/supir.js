const express = require('express');
const router = express.Router();
const db = require('../config/db');

// READ - List Supir
router.get('/', (req, res) => {
  db.query('SELECT * FROM data_supir', (err, results) => {
    if (err) throw err;
    res.render('supir/index', { data: results });
  });
});

// CREATE - Form Tambah Supir
router.get('/create', (req, res) => {
  res.render('supir/create');
});

// CREATE - Simpan Supir Baru
router.post('/create', (req, res) => {
  const { nama_supir, no_hp, alamat, status } = req.body;
  db.query('INSERT INTO data_supir (nama_supir, no_hp, alamat, status) VALUES (?, ?, ?, ?)', 
    [nama_supir, no_hp, alamat, status], 
    (err) => {
      if (err) throw err;
      res.redirect('/supir');
    });
});

// UPDATE - Form Edit Supir
router.get('/edit/:id', (req, res) => {
  db.query('SELECT * FROM data_supir WHERE id_supir = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('supir/edit', { supir: results[0] });
  });
});

// UPDATE - Simpan Perubahan
router.post('/edit/:id', (req, res) => {
  const { nama_supir, no_hp, alamat, status } = req.body;
  db.query('UPDATE data_supir SET nama_supir = ?, no_hp = ?, alamat = ?, status = ? WHERE id_supir = ?', 
    [nama_supir, no_hp, alamat, status, req.params.id], 
    (err) => {
      if (err) throw err;
      res.redirect('/supir');
    });
});

// DELETE - Hapus Supir
router.get('/delete/:id', (req, res) => {
  db.query('DELETE FROM data_supir WHERE id_supir = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/supir');
  });
});

module.exports = router;
