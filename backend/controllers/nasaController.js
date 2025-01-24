const axios = require('axios');
require('dotenv').config();

const NASA_API_KEY = process.env.NASA_API_KEY;

const getNasaAPOD = async (req, res) => {
    try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching NASA APOD data', error: error.message });
    }
};

const getMarsPhotos = async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos?api_key=${NASA_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Mars photos', error: error.message });
    }
};

const getNeoData = async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.nasa.gov/neo/rest/v1/feed/today?detailed=false&api_key=${NASA_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching NEO data', error: error.message });
    }
};

module.exports = {
    getNasaAPOD,
    getMarsPhotos,
    getNeoData
};

const getMarsWeather = async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Mars weather', error: error.message });
    }
};

const getSpaceEvents = async (req, res) => {
    try {
        // Implement space events fetching
        res.json({ events: [] });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching space events', error: error.message });
    }
};