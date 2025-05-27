const express = require('express');
const router = express.Router();

// Route: /edukasi/perawatan
router.get('/perawatan', (req, res) => {
  res.render('edukasi/perawatan', { title: 'Perawatan Kendaraan' });
});

// Route: /edukasi/hematbbm
router.get('/hematbbm', (req, res) => {
  res.render('edukasi/hematbbm', { title: 'Tips Hemat BBM' });
});

// Route: /edukasi/keamanan
router.get('/keamanan', (req, res) => {
  res.render('edukasi/keamanan', { title: 'Keamanan di Jalan' });
});

module.exports = router;
