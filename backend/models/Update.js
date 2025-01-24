const mongoose = require('mongoose');

const UpdateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Mission', 'Discovery', 'Maintenance', 'General']
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Low'
    },
    relatedInstrument: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Update', UpdateSchema);