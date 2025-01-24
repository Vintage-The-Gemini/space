const express = require('express');
const router = express.Router();
const { getNasaAPOD, getMarsPhotos, getNeoData } = require('../controllers/nasaController');

router.get('/apod', getNasaAPOD);
router.get('/mars-photos', getMarsPhotos);
router.get('/neo', getNeoData);

module.exports = router;