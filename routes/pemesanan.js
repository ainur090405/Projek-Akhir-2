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
    if (err) {
      console.error("Error fetching pemesanan:", err);
      return res.status(500).send("Terjadi kesalahan saat mengambil data.");
    }
    res.render('pemesanan/index', { data: rows, messages: req.flash() });
  });
});

// FORM CREATE
router.get('/create', (req, res) => {
  db.query("SELECT * FROM users", (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Gagal mengambil data user.");
    }
    db.query("SELECT * FROM data_kendaraan", (err, kendaraan) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Gagal mengambil data kendaraan.");
      }
      db.query("SELECT * FROM data_supir WHERE status = 'aktif'", (err, supir) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Gagal mengambil data supir.");
        }
        res.render('pemesanan/create', { users, kendaraan, supir });
      });
    });
  });
});

// ACTION CREATE
router.post('/store', (req, res) => {
  const { id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan } = req.body;

  if (!id_user || !id_kendaraan || !id_supir || !tanggal || !waktu_mulai || !waktu_selesai || !status) {
    req.flash('error', 'Semua field wajib diisi.');
    return res.redirect('/pemesanan/create');
  }

  db.query(`
    INSERT INTO pemesanan_kendaraan (id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan], (err) => {
    if (err) {
      console.error("Error insert pemesanan:", err);
      return res.status(500).send("Gagal menyimpan data.");
    }
    req.flash('success', 'Pemesanan berhasil ditambahkan!');
    res.redirect('/pemesanan');
  });
});

// FORM EDIT
router.get('/edit/:id', (req, res) => {
  db.query("SELECT * FROM pemesanan_kendaraan WHERE id_pemesanan = ?", [req.params.id], (err, pemesanan) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Gagal mengambil data pemesanan.");
    }
    if (pemesanan.length === 0) {
      req.flash('error', 'Data tidak ditemukan.');
      return res.redirect('/pemesanan');
    }
    db.query("SELECT * FROM users", (err, users) => {
      if (err) return res.send(err);
      db.query("SELECT * FROM data_kendaraan", (err, kendaraan) => {
        if (err) return res.send(err);
        db.query("SELECT * FROM data_supir WHERE status = 'aktif'", (err, supir) => {
          if (err) return res.send(err);
          res.render('pemesanan/edit', {
            data: pemesanan[0],
            users,
            kendaraan,
            supir
          });
        });
      });
    });
  });
});

// ACTION UPDATE
router.post('/update/:id', (req, res) => {
  const { id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan } = req.body;

  if (!id_user || !id_kendaraan || !id_supir || !tanggal || !waktu_mulai || !waktu_selesai || !status) {
    req.flash('error', 'Semua field wajib diisi.');
    return res.redirect(`/pemesanan/edit/${req.params.id}`);
  }

  db.query(`
    UPDATE pemesanan_kendaraan
    SET id_user=?, id_kendaraan=?, id_supir=?, tanggal=?, waktu_mulai=?, waktu_selesai=?, status=?, keterangan=?
    WHERE id_pemesanan=?
  `, [id_user, id_kendaraan, id_supir, tanggal, waktu_mulai, waktu_selesai, status, keterangan, req.params.id], (err) => {
    if (err) {
      console.error("Error update pemesanan:", err);
      return res.status(500).send("Gagal memperbarui data.");
    }
    req.flash('success', 'Pemesanan berhasil diperbarui!');
    res.redirect('/pemesanan');
  });
});

// ACTION DELETE
router.get('/hapus/:id', (req, res) => {
  db.query("DELETE FROM pemesanan_kendaraan WHERE id_pemesanan = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error hapus pemesanan:", err);
      return res.status(500).send("Gagal menghapus data.");
    }
    req.flash('success', 'Pemesanan berhasil dihapus!');
    res.redirect('/pemesanan');
  });
});

module.exports = router;
