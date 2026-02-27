const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// @route   POST /api/alerts
// @desc    Create a new alert (fish spotting or SOS)
router.post('/', async (req, res) => {
    try {
        const { type, location, message, userId } = req.body;

        // Mocking user for now if not provided, using a sample UUID
        const finalUserId = userId || "00000000-0000-0000-0000-000000000001";

        const { data: alert, error } = await supabase
            .from('alerts')
            .insert([{
                user_id: finalUserId,
                type,
                location,
                message,
                status: 'active'
            }])
            .select()
            .single();

        if (error) throw error;
        res.json(alert);
    } catch (err) {
        console.error('Create Alert Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/alerts
// @desc    Get all active alerts
router.get('/', async (req, res) => {
    try {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: alerts, error } = await supabase
            .from('alerts')
            .select(`
                *,
                user:users(name)
            `)
            .eq('status', 'active')
            .gte('created_at', yesterday);

        if (error) throw error;
        res.json(alerts);
    } catch (err) {
        console.error('Get Alerts Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
