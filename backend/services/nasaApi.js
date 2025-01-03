const axios = require('axios');

class NasaApiService {
    constructor() {
        if (!process.env.NASA_API_KEY) {
            throw new Error('NASA API key is not defined in environment variables');
        }
        this.apiKey = process.env.NASA_API_KEY;
        this.baseURL = 'https://api.nasa.gov';
    }

    async getAstronomyPictureOfDay() {
        try {
            const response = await axios.get(`${this.baseURL}/planetary/apod`, {
                params: { api_key: this.apiKey }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching APOD:', error);
            throw error;
        }
    }

    async getMarsRoverPhotos(roverName = 'curiosity', sol = 1000) {
        try {
            const response = await axios.get(
                `${this.baseURL}/mars-photos/api/v1/rovers/${roverName}/photos`,
                {
                    params: {
                        sol,
                        api_key: this.apiKey
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching Mars Rover photos:', error);
            throw error;
        }
    }

    async getNeoFeed(startDate, endDate) {
        try {
            const response = await axios.get(
                `${this.baseURL}/neo/rest/v1/feed`,
                {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        api_key: this.apiKey
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching NEO feed:', error);
            throw error;
        }
    }

    async getEarthImagery(lat, lon, date) {
        try {
            const response = await axios.get(
                `${this.baseURL}/planetary/earth/imagery`,
                {
                    params: {
                        lat,
                        lon,
                        date,
                        api_key: this.apiKey
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching Earth imagery:', error);
            throw error;
        }
    }
}

// Create and export a single instance
const nasaApi = new NasaApiService();
module.exports = nasaApi;