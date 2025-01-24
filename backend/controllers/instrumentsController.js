const Instrument = require('../models/Instrument');

// @desc    Get all instruments
// @route   GET /api/instruments
// @access  Public
const getInstruments = async (req, res) => {
    try {
        const instruments = await Instrument.find();
        res.json(instruments);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single instrument
// @route   GET /api/instruments/:id
// @access  Public
const getInstrument = async (req, res) => {
    try {
        const instrument = await Instrument.findById(req.params.id);
        if (!instrument) {
            return res.status(404).json({
                success: false,
                error: 'Instrument not found'
            });
        }
        res.json(instrument);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Add instrument
// @route   POST /api/instruments
// @access  Private
const addInstrument = async (req, res) => {
    try {
        const instrument = await Instrument.create(req.body);
        res.status(201).json({
            success: true,
            data: instrument
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
};

// @desc    Update instrument
// @route   PUT /api/instruments/:id
// @access  Private
const updateInstrument = async (req, res) => {
    try {
        const instrument = await Instrument.findById(req.params.id);
        if (!instrument) {
            return res.status(404).json({
                success: false,
                error: 'Instrument not found'
            });
        }
        
        const updatedInstrument = await Instrument.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedInstrument
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Delete instrument
// @route   DELETE /api/instruments/:id
// @access  Private
const deleteInstrument = async (req, res) => {
    try {
        const instrument = await Instrument.findById(req.params.id);
        if (!instrument) {
            return res.status(404).json({
                success: false,
                error: 'Instrument not found'
            });
        }

        await instrument.remove();
        res.json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

module.exports = {
    getInstruments,
    getInstrument,
    addInstrument,
    updateInstrument,
    deleteInstrument
};