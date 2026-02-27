const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @desc    Get market prices
// @route   GET /api/market/prices
// @access  Private
router.get('/prices', protect, (req, res) => {
    const { species = 'Pomfret' } = req.query;

    // Simulate Dynamic Prices
    // In a real app, this would fetch from a database or a market API
    const hour = new Date().getHours();
    const basePrice = species === 'Pomfret' ? 250 : 180;

    // Price fluctuates based on time of day
    const fluctuation = Math.sin(hour / 4) * 50;

    const markets = [
        {
            id: 1,
            name: 'Local Harbor (Port A)',
            distance: '2 km',
            price: Math.round(basePrice + fluctuation),
            fuelCost: 50,
            isRecommended: false
        },
        {
            id: 2,
            name: 'City Port (Port B)',
            distance: '15 km',
            price: Math.round(basePrice + Math.abs(fluctuation) + 100),
            fuelCost: 300,
            isRecommended: true
        },
        {
            id: 3,
            name: 'Export Hub (Port C)',
            distance: '40 km',
            price: Math.round(basePrice + 120),
            fuelCost: 800,
            isRecommended: false
        },
    ];

    res.json({
        species,
        lastUpdated: new Date().toISOString(),
        markets
    });
});

module.exports = router;
