const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Private
const axios = require('axios');

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Private
router.get('/current', protect, async (req, res) => {
    try {
        let { lat, lng, locationName } = req.query;

        // Simple coordinate lookup for major coastal cities
        const locationCoords = {
            'Mumbai': { lat: 18.975, lng: 72.825 },
            'Chennai': { lat: 13.0827, lng: 80.2707 },
            'Kolkata': { lat: 22.5726, lng: 88.3639 },
            'Goa': { lat: 15.4909, lng: 73.8278 },
            'Kochi': { lat: 9.9312, lng: 76.2673 },
            'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
            'Mangalore': { lat: 12.9141, lng: 74.8560 },
            'Kanyakumari': { lat: 8.0883, lng: 77.5385 }
        };

        if ((!lat || !lng) && locationName) {
            // Find best match in our map
            const match = Object.keys(locationCoords).find(k =>
                locationName.toLowerCase().includes(k.toLowerCase())
            );
            if (match) {
                lat = locationCoords[match].lat;
                lng = locationCoords[match].lng;
                locationName = match;
            }
        }

        // Final defaults if still missing
        lat = lat || 18.975;
        lng = lng || 72.825;
        locationName = locationName || 'Mumbai Coast';

        // Fetch Marine Weather from Open-Meteo
        const response = await axios.get('https://marine-api.open-meteo.com/v1/marine', {
            params: {
                latitude: lat,
                longitude: lng,
                current: 'wave_height,wind_speed_10m',
                hourly: 'wave_height,wind_speed_10m',
                daily: 'wave_height_max',
                timezone: 'auto'
            }
        });

        const data = response.data;
        const current = data.current;

        // Map risk level based on wave height and wind speed
        let riskLevel = 'Low';
        if (current.wave_height > 2.5 || current.wind_speed_10m > 25) {
            riskLevel = 'High';
        } else if (current.wave_height > 1.5 || current.wind_speed_10m > 15) {
            riskLevel = 'Moderate';
        }

        // Map to our local data structure
        const weatherData = {
            location: locationName,
            temp: 28, // Open-Meteo marine doesn't always provide air temp, defaulting for now
            condition: current.wave_height > 2 ? 'Heavy Swell' : 'Clear Sea',
            windSpeed: Math.round(current.wind_speed_10m * 0.539957), // km/h to knots
            waveHeight: current.wave_height,
            visibility: 10,
            pressure: 1012,
            humidity: 78,
            riskLevel: riskLevel,
            forecast: data.daily.time.slice(0, 3).map((time, idx) => ({
                day: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
                temp: 27 - idx,
                wind: Math.round(data.hourly.wind_speed_10m[idx * 24] * 0.539957 || 10),
                condition: data.hourly.wind_speed_10m[idx * 24] > 20 ? 'High Wind' : (data.daily.wave_height_max[idx] > 2 ? 'Rough' : 'Safe')
            }))
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Weather API Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch real-time weather data' });
    }
});

module.exports = router;
