const Instrument = require('../models/Instrument');
const asyncHandler = require('express-async-handler');

// @desc    Get all instruments
// @route   GET /api/instruments
// @access  Public
const getInstruments = asyncHandler(async (req, res) => {
    const { type, status, sort, select } = req.query;
    let query = {};

    // Build query
    if (type) query.type = type;
    if (status) query.status = status;

    let result = Instrument.find(query);

    // Select Fields
    if (select) {
        const fields = select.split(',').join(' ');
        result = result.select(fields);
    }

    // Sort
    if (sort) {
        const sortBy = sort.split(',').join(' ');
        result = result.sort(sortBy);
    } else {
        result = result.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Instrument.countDocuments(query);

    result = result.skip(startIndex).limit(limit);

    // Execute query
    const instruments = await result;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: instruments.length,
        pagination,
        data: instruments
    });
});

// @desc    Get single instrument
// @route   GET /api/instruments/:id
// @access  Public
const getInstrument = asyncHandler(async (req, res) => {
    const instrument = await Instrument.findById(req.params.id);

    if (!instrument) {
        res.status(404);
        throw new Error('Instrument not found');
    }

    res.status(200).json({
        success: true,
        data: instrument
    });
});

// @desc    Create new instrument
// @route   POST /api/instruments
// @access  Private
const createInstrument = asyncHandler(async (req, res) => {
    const instrument = await Instrument.create(req.body);
    res.status(201).json({
        success: true,
        data: instrument
    });
});

// @desc    Update instrument
// @route   PUT /api/instruments/:id
// @access  Private
const updateInstrument = asyncHandler(async (req, res) => {
    let instrument = await Instrument.findById(req.params.id);

    if (!instrument) {
        res.status(404);
        throw new Error('Instrument not found');
    }

    instrument = await Instrument.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: instrument
    });
});

// @desc    Delete instrument
// @route   DELETE /api/instruments/:id
// @access  Private
const deleteInstrument = asyncHandler(async (req, res) => {
    const instrument = await Instrument.findById(req.params.id);

    if (!instrument) {
        res.status(404);
        throw new Error('Instrument not found');
    }

    await instrument.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get instrument statistics
// @route   GET /api/instruments/stats
// @access  Public
const getInstrumentStats = asyncHandler(async (req, res) => {
    const stats = await Instrument.aggregate([
        {
            $group: {
                _id: '$type',
                count: { $sum: 1 },
                avgAge: { $avg: { $subtract: [new Date(), '$discoveryDate'] } },
                activeCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
                }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: stats
    });
});

module.exports = {
    getInstruments,
    getInstrument,
    createInstrument,
    updateInstrument,
    deleteInstrument,
    getInstrumentStats
};