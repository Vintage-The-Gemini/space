const express = require('express');
const router = express.Router();
const {
    getInstruments,
    getInstrument,
    createInstrument,
    updateInstrument,
    deleteInstrument,
    getInstrumentStats
} = require('../controllers/instrumentsController');

// Base route: /api/instruments
router.route('/').get(getInstruments).post(createInstrument);
router.route('/stats').get(getInstrumentStats);
router.route('/:id')
    .get(getInstrument)
    .put(updateInstrument)
    .delete(deleteInstrument);

module.exports = router;