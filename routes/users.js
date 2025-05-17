const express = require('express');
const router = express.Router();
const connection = require('../db');

// Menampilkan daftar users
router.get('/', (req, res) => {
  connection.query('SELECT * FROM users ORDER BY id ASC', (err, rows) => {
    if (err) {
      console.log('Error:', err); // Tambahkan baris ini
      req.flash('error', 'Gagal mengambil data: ' + err.message);
      return res.redirect('/');
    }

    console.log('Data berhasil diambil:', rows.length); // Tambahkan baris ini

    res.render('users/index', {
      data: rows,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }
    });
  });
});


// Form tambah user
router.get('/create', (req, res) => {
  res.render('users/create');
});

// Simpan user baru
router.post('/store', (req, res) => {
  const { username, password, email, role } = req.body;
  const data = { username, password, email, role };

  connection.query('INSERT INTO users SET ?', data, (err) => {
    if (err) {
      req.flash('error', 'Gagal menyimpan data: ' + err.message);
    } else {
      req.flash('success', 'Berhasil menyimpan data');
    }
    res.redirect('/users');
  });
});

// Form edit user
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
    if (err || rows.length === 0) {
      req.flash('error', 'User tidak ditemukan');
      return res.redirect('/users');
    }

    res.render('users/edit', { user: rows[0] });
  });
});

// Update user
router.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const { username, password, email, role } = req.body;
  const data = { username, email, role };
  if (password && password.trim() !== '') {
    data.password = password;
  }

  connection.query('UPDATE users SET ? WHERE id = ?', [data, id], (err) => {
    if (err) {
      req.flash('error', 'Gagal memperbarui data: ' + err.message);
    } else {
      req.flash('success', 'Berhasil memperbarui data');
    }
    res.redirect('/users');
  });
});


// Hapus user
router.get('/delete/:id', (req, res) => {
  const id = req.params.id;

  connection.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      req.flash('error', 'Gagal menghapus data: ' + err.message);
    } else {
      req.flash('success', 'Data berhasil dihapus');
    }
    res.redirect('/users');
  });
});

module.exports = router;
