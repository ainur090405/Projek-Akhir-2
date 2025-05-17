const express = require('express');
const router = express.Router();
const db = require('../db');

// Fungsi validasi email
function isValidEmail(email) {
  const regex = /^[^\s@]+@gmail\.com$/;
  return regex.test(email);
}
// Middleware untuk admin
function isAdmin(req, res, next) {
  if (req.session && req.session.isLoggedIn && req.session.role === 'admin') {
    next();
  } else {
    res.status(403).send('Akses ditolak. Hanya admin yang bisa mengakses halaman ini.');
  }
}
// GET form register
router.get('/register', (req, res) => {
  res.render('register', {
    error: req.query.error || null,
    success: req.query.success || null
  });
});

// POST register
router.post('/register', (req, res) => {
  const { email, username, password } = req.body;

  // Validasi format email
  if (!isValidEmail(email)) {
    const msg = encodeURIComponent('Format email harus valid!!');
    return res.redirect('/register?error=' + msg);
  }

  // cek email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      const msg = encodeURIComponent('Terjadi kesalahan server.');
      return res.redirect('/register?error=' + msg);
    }

    if (results.length > 0) {
      const msg = encodeURIComponent('Email sudah digunakan.');
      return res.redirect('/register?error=' + msg);
    }

    // user baru
    db.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, password],
      (err2) => {
        if (err2) {
          console.error('Insert error:', err2);
          const msg = encodeURIComponent('Gagal membuat akun.');
          return res.redirect('/register?error=' + msg);
        }

        const msg = encodeURIComponent('Akun berhasil dibuat. Silakan login.');
        res.redirect('/login?success=' + msg);
      }
    );
  });
});

// login
router.get('/login', (req, res) => {
  res.render('login', {
    error: req.query.error || null,
    success: req.query.success || null
  });
});

// POST login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Login error:', err);
        const msg = encodeURIComponent('Terjadi kesalahan server.');
        return res.redirect('/login?error=' + msg);
      }
      if (results.length > 0) {
        req.session.isLoggedIn = true;
        req.session.username = results[0].username;
        req.session.role = results[0].role; 
        const msg = encodeURIComponent('Yey, Login berhasil !!');
        res.redirect('/?success=' + msg);
      } else {
        const msg = encodeURIComponent('Email atau password salah.');
        return res.redirect('/login?error=' + msg);
      }
    }
  );
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Error destroying session:', err);
    }
    res.redirect('/');
  });
});



module.exports = { router, isAdmin };
