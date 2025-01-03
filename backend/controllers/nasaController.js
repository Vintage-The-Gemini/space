const asyncHandler = require('express-async-handler');
const nasaApi = require('../services/nasaApi');

// @desc    Get Astronomy Picture of the Day
// @route   GET /api/nasa/apod
// @access  Public
const getAstronomyPicture = asyncHandler(async (req, res) => {
    const data = await nasaApi.getAstronomyPictureOfDay();
    res.json(data);
});

// @desc    Get Mars Rover Photos
// @route   GET /api/nasa/mars-photos
// @access  Public
const getMarsPhotos = asyncHandler(async (req, res) => {
    const { rover = 'curiosity', sol = 1000 } = req.query;
    const data = await nasaApi.getMarsRoverPhotos(rover, parseInt(sol));
    res.json(data);
});

// @desc    Get Near Earth Objects
// @route   GET /api/nasa/neo-feed
// @access  Public
const getNearEarthObjects = asyncHandler(async (req, res) => {
    const { start_date, end_date } = req.query;
    const data = await nasaApi.getNeoFeed(start_date, end_date);
    res.json(data);
});

// @desc    Get Earth Imagery
// @route   GET /api/nasa/earth-imagery
// @access  Public
const getEarthImagery = asyncHandler(async (req, res) => {
    const { lat, lon, date } = req.query;
    const data = await nasaApi.getEarthImagery(lat, lon, date);
    res.json(data);
});

module.exports = {
    getAstronomyPicture,
    getMarsPhotos,
    getNearEarthObjects,
    getEarthImagery
};