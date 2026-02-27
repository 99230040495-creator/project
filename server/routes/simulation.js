const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all active scenarios
// @route   GET /api/simulations
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { data: scenarios, error } = await supabase
            .from('scenarios')
            .select()
            .eq('is_active', true);

        if (error) throw error;
        res.json(scenarios);
    } catch (error) {
        console.error('Get Scenarios Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get a single scenario by ID
// @route   GET /api/simulations/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const { data: scenario, error } = await supabase
            .from('scenarios')
            .select()
            .eq('id', req.params.id)
            .single();

        if (error || !scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        res.json(scenario);
    } catch (error) {
        console.error('Get Scenario Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Submit simulation result
// @route   POST /api/simulations/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
    const { action } = req.body;
    try {
        const { data: scenario } = await supabase
            .from('scenarios')
            .select()
            .eq('id', req.params.id)
            .single();

        if (!scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }

        const isCorrect = action === scenario.correct_action;
        const score = isCorrect ? scenario.points : 0;

        // Upsert progress
        const { data: progress, error: upsertError } = await supabase
            .from('user_progress')
            .upsert({
                user_id: req.user.id,
                scenario_id: scenario.id,
                status: isCorrect ? 'completed' : 'failed',
                user_action: action,
                score_earned: score,
                last_attempt_at: new Date().toISOString()
            }, {
                onConflict: 'user_id, scenario_id'
            })
            .select()
            .single();

        if (upsertError) throw upsertError;

        res.json({
            success: isCorrect,
            scoreEarned: score,
            feedback: scenario.educational_feedback,
            redFlags: scenario.red_flags,
            progress
        });
    } catch (error) {
        console.error('Submit Result Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get user's overall progress
// @route   GET /api/simulations/user/progress
// @access  Private
router.get('/user/progress', protect, async (req, res) => {
    try {
        const { data: progress, error } = await supabase
            .from('user_progress')
            .select('*, scenarios(*)')
            .eq('user_id', req.user.id);

        if (error) throw error;

        const totalScore = progress.reduce((acc, curr) => acc + curr.score_earned, 0);
        const completedCount = progress.filter(p => p.status === 'completed').length;

        res.json({
            totalScore,
            completedCount,
            detailedProgress: progress
        });
    } catch (error) {
        console.error('Get Progress Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
