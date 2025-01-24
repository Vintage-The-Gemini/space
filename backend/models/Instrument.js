const mongoose = require('mongoose');

const InstrumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive', 'Maintenance', 'Retired']
    },
    discoveryDate: {
        type: Date,
        required: true,
    },
    telemetry: {
        signalStrength: Number,
        temperature: Number,
        lastUpdate: {
            type: Date,
            default: Date.now
        }
    },
    location: String,
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Instrument', InstrumentSchema);