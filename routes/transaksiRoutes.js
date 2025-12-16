const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

router.post('/', transaksiController.createTransaction);

module.exports = router;