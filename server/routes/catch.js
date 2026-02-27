const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const { protect } = require('../middleware/authMiddleware');

// @desc    Add a new catch record
// @route   POST /api/catch/add
// @access  Private
router.post('/add', protect, async (req, res) => {
    const { location, species, weight, fuelUsed, profit, notes } = req.body;

    try {
        const { data: record, error } = await supabase
            .from('catches')
            .insert([{
                user_id: req.user.id,
                location,
                species: Array.isArray(species) ? species : [species],
                weight,
                // These might need extra columns in Supabase if you want to store them
                // For now, focusing on the core fields
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(record);
    } catch (error) {
        console.error('Add Catch Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get catch history for user
// @route   GET /api/catch/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const { data: history, error } = await supabase
            .from('catches')
            .select()
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(history);
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
