const express = require('express');
const router = express.Router();
const Update = require('../models/Update');

// @desc    Get all updates
// @route   GET /api/updates
// @access  Public
router.get('/', async (req, res) => {
    try {
        const updates = await Update.find()
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(updates);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @desc    Create new update
// @route   POST /api/updates
// @access  Private
router.post('/', async (req, res) => {
    try {
        const update = await Update.create(req.body);
        res.status(201).json({
            success: true,
            data: update
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;