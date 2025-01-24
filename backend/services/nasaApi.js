const axios = require('axios');

class NasaApiService {
    constructor() {
        this.baseUrl = 'https://api.nasa.gov';
        this.apiKey = process.env.NASA_API_KEY;
    }

    // Get Astronomy Picture of the Day
    async getAPOD() {
        try {
            const response = await axios.get(`${this.baseUrl}/planetary/apod?api_key=${this.apiKey}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching APOD:', error);
            throw error;
        }
    }

    // Get Mars Rover photos
    async getMarsPhotos(rover = 'curiosity', sol = 1000) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${this.apiKey}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching Mars photos:', error);
            throw error;
        }
    }

    // Get Near Earth Objects
    async getNeoFeed(startDate, endDate) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching NEO data:', error);
            throw error;
        }
    }

    // Get Earth imagery
    async getEarthImagery(lat, lon, date) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/planetary/earth/assets?lon=${lon}&lat=${lat}&date=${date}&api_key=${this.apiKey}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching Earth imagery:', error);
            throw error;
        }
    }
}

module.exports = new NasaApiService();