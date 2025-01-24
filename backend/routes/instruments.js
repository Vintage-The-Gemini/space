const express = require('express');
const router = express.Router();
const {
    getInstruments,
    getInstrument,
    addInstrument,
    updateInstrument,
    deleteInstrument
} = require('../controllers/instrumentsController');

router
    .route('/')
    .get(getInstruments)
    .post(addInstrument);

router
    .route('/:id')
    .get(getInstrument)
    .put(updateInstrument)
    .delete(deleteInstrument);

module.exports = router;