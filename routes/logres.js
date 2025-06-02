const express = require('express');
const router = express.Router();
const db = require('../config/db'); // mysql biasa

// Validasi email hanya @gmail.com
function isValidEmail(email) {
  const regex = /^[^\s@]+@gmail\.com$/;
  return regex.test(email);
}

// Middleware admin
function isAdmin(req, res, next) {
  if (req.session && req.session.isLoggedIn && req.session.role === 'admin') {
    next();
  } else {
    res.status(403).send('Akses ditolak. Hanya admin yang bisa mengakses halaman ini.');
  }
}

// ==============================
// GET: Register
router.get('/register', (req, res) => {
  res.render('register', {
    error: req.query.error || null,
    success: req.query.success || null
  });
});

// POST: Register
router.post('/register', (req, res) => {
  const { email, username, password } = req.body;

  if (!isValidEmail(email)) {
    return res.redirect('/register?error=' + encodeURIComponent('Format email harus @gmail.com!!'));
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.redirect('/register?error=' + encodeURIComponent('Terjadi kesalahan server.'));
    }

    if (results.length > 0) {
      return res.redirect('/register?error=' + encodeURIComponent('Email sudah digunakan.'));
    }

    db.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, password],
      (err2) => {
        if (err2) {
          console.error('Insert error:', err2);
          return res.redirect('/register?error=' + encodeURIComponent('Gagal membuat akun.'));
        }

        res.redirect('/login?success=' + encodeURIComponent('Akun berhasil dibuat! Silakan login.'));
      }
    );
  });
});

// ==============================
// GET: Login
router.get('/login', (req, res) => {
  res.render('login', {
    error: req.query.error || null,
    success: req.query.success || null
  });
});

// POST: Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Login error:', err);
        return res.redirect('/login?error=' + encodeURIComponent('Terjadi kesalahan server.'));
      }

      if (results.length > 0) {
        const user = results[0];
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.role = user.role;
        req.session.user = user;

        res.redirect('/?success=' + encodeURIComponent('Yey, Login berhasil!!'));
      } else {
        res.redirect('/login?error=' + encodeURIComponent('Email atau password salah.'));
      }
    }
  );
});

// ==============================
// GET: Profile
router.get('/profile', (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login?error=' + encodeURIComponent('Silakan login dulu ya!'));
  }

  const userId = req.session.userId;

  db.query('SELECT username, email, password FROM users WHERE id = ?', [userId], (err, userRows) => {
    if (err) {
      console.error('User query error:', err);
      return res.status(500).send('Gagal ambil data user.');
    }

    db.query(`
      SELECT u.rating, u.komentar, u.tanggal, k.nama_kendaraan
      FROM ulasan_kendaraan u
      JOIN data_kendaraan k ON u.id_kendaraan = k.id_kendaraan
      WHERE u.id_user = ?
    `, [userId], (err2, ulasanRows) => {
      if (err2) {
        console.error('Ulasan query error:', err2);
        return res.status(500).send('Gagal ambil ulasan.');
      }

      db.query(`
        SELECT p.tanggal, p.waktu_mulai, p.waktu_selesai, p.status, 
               k.nama_kendaraan, s.nama_supir
        FROM pemesanan_kendaraan p
        JOIN data_kendaraan k ON p.id_kendaraan = k.id_kendaraan
        JOIN data_supir s ON p.id_supir = s.id_supir
        WHERE p.id_user = ?
        ORDER BY p.tanggal DESC
      `, [userId], (err3, pemesananRows) => {
        if (err3) {
          console.error('Pemesanan query error:', err3);
          return res.status(500).send('Gagal ambil data pemesanan.');
        }

        res.render('profile', {
          user: userRows[0],
          ulasan: ulasanRows,
          pemesanan: pemesananRows
        });
      });
    });
  });
});

// ==============================
// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = { router, isAdmin };
