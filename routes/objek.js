var express = require('express');
var router = express.Router();
var db = require('../db');

// Route: Tampilkan semua kategori
router.get('/kategori', (req, res) => {
  var sql = 'SELECT * FROM kategori';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Gagal mengambil kategori:', err);
      return res.status(500).send('Gagal memuat kategori');
    }
    res.render('kategori/index', { kategoriList: results });
  });
});

// Route utama: GET /objek?kategori=buah&page=2
router.get('/', (req, res) => {
  var kategoriNama = req.query.kategori || null;
  var page = parseInt(req.query.page) || 1;
  var limit = 6;
  var offset = (page - 1) * limit;
  var tampilkanSemua = req.query.all === 'true';

  let countSql = 'SELECT COUNT(*) AS total FROM objek o LEFT JOIN kategori k ON o.kategori_id = k.id';
  let dataSql = 'SELECT o.*, k.nama_kategori FROM objek o LEFT JOIN kategori k ON o.kategori_id = k.id';
  let whereClause = '';
  let queryParams = [];

  if (kategoriNama) {
    whereClause = ' WHERE k.nama_kategori = ? ';
    queryParams.push(kategoriNama);
  }

  // Query total count untuk pagination
  db.query(countSql + whereClause, queryParams, (err, countResult) => {
    if (err) {
      console.error('Gagal mengambil jumlah data:', err);
      return res.status(500).send('Gagal memuat data');
    }

    var totalItems = countResult[0].total;
    var totalPages = Math.ceil(totalItems / limit);
    let fullDataSql;
    let dataParams;

    if (tampilkanSemua) {
      fullDataSql = dataSql + whereClause + ' ORDER BY o.id DESC';
      dataParams = queryParams;
      page = 1; // reset halaman ke 1
    } else {
      fullDataSql = dataSql + whereClause + ' ORDER BY o.id DESC LIMIT ? OFFSET ?';
      dataParams = [...queryParams, limit, offset];
    }

    db.query(fullDataSql, [...queryParams, limit, offset], (err, objekList) => {
      if (err) {
        console.error('Gagal mengambil data objek:', err);
        return res.status(500).send('Gagal memuat objek');
      }

      // Ambil daftar ID objek utama untuk dikecualikan dari carousel
      const excludeIds = objekList.map(obj => obj.id);

      // Bangun query carousel dengan pengecualian
      let carouselSql = `
        SELECT o.*, k.nama_kategori
        FROM objek o
        LEFT JOIN kategori k ON o.kategori_id = k.id
      `;
      let carouselParams = [];

      if (excludeIds.length > 0) {
        const placeholders = excludeIds.map(() => '?').join(', ');
        carouselSql += ` WHERE o.id NOT IN (${placeholders}) `;
        carouselParams = excludeIds;
      }

      carouselSql += ' ORDER BY RAND() LIMIT 10';

      db.query(carouselSql, carouselParams, (err, carouselItems) => {
        if (err) {
          console.error('Gagal mengambil carousel:', err);
          return res.status(500).send('Gagal memuat carousel');
        }

        // Ambil semua kategori
        db.query('SELECT * FROM kategori', (err, kategoriList) => {
          if (err) {
            console.error('Gagal mengambil kategori:', err);
            return res.status(500).send('Gagal memuat kategori');
          }

          res.render('objek', {
            objekList,
            carouselItems,
            totalPages,
            currentPage: page,
            kategoriAktif: kategoriNama,
            kategoriList,
            tampilkanSemua
          });
        });
      });
    });
  });
});

// Route: Data JSON semua objek (untuk AJAX "Tampilkan Semua")
router.get('/semua', (req, res) => {
  const sql = `
    SELECT o.*, k.nama_kategori
    FROM objek o
    LEFT JOIN kategori k ON o.kategori_id = k.id
    ORDER BY o.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Gagal mengambil semua objek:', err);
      return res.status(500).json({ error: 'Gagal mengambil data' });
    }
    res.json(results);
  });
});

// Route: Detail objek berdasarkan ID
router.get('/:id', (req, res) => {
  const objekId = req.params.id;

  const sql = `
    SELECT o.*, k.nama_kategori 
    FROM objek o 
    LEFT JOIN kategori k ON o.kategori_id = k.id 
    WHERE o.id = ?
  `;

  db.query(sql, [objekId], (err, results) => {
    if (err) {
      console.error('Gagal mengambil detail objek:', err);
      return res.status(500).send('Gagal memuat detail objek');
    }

    if (results.length === 0) {
      return res.status(404).render('error', { message: 'Objek tidak ditemukan' });
    }

    const objek = results[0];
    res.render('detail', { objek });
  });
});

module.exports = router;
