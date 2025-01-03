const express = require('express');
const router = express.Router();
const {
    getAstronomyPicture,
    getMarsPhotos,
    getNearEarthObjects,
    getEarthImagery
} = require('../controllers/nasaController');

// Base route: /api/nasa
router.get('/apod', getAstronomyPicture);
router.get('/mars-photos', getMarsPhotos);
router.get('/neo-feed', getNearEarthObjects);
router.get('/earth-imagery', getEarthImagery);

module.exports = router;