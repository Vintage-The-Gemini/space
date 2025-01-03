const mongoose = require('mongoose');

const InstrumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    type: {
        type: String,
        required: [true, 'Please add a type'],
        enum: [
            'Telescope',
            'Satellite',
            'Rover',
            'Probe',
            'Space Station',
            'Observatory'
        ]
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive', 'Maintenance', 'Decommissioned'],
        default: 'Active'
    },
    location: {
        type: String,
        required: true
    },
    discoveryDate: {
        type: Date,
        required: true
    },
    lastContact: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    specifications: {
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: {
                type: String,
                default: 'meters'
            }
        },
        weight: {
            value: Number,
            unit: {
                type: String,
                default: 'kg'
            }
        },
        powerSource: String,
        operationalRange: String
    },
    mission: {
        name: String,
        objectives: [String],
        startDate: Date,
        endDate: Date,
        agency: String
    },
    dataCollection: [{
        type: {
            type: String,
            required: true
        },
        frequency: String,
        lastUpdate: Date,
        metrics: mongoose.Schema.Types.Mixed
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add index for better query performance
InstrumentSchema.index({ name: 1, type: 1 });

// Virtual for instrument age
InstrumentSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.discoveryDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update lastContact
InstrumentSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.lastContact = Date.now();
    }
    next();
});

// Instance method to check if maintenance is needed
InstrumentSchema.methods.needsMaintenance = function() {
    const lastMaintenanceDate = this.lastContact;
    const maintenanceInterval = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    return Date.now() - lastMaintenanceDate > maintenanceInterval;
};

// Static method to find active instruments
InstrumentSchema.statics.findActive = function() {
    return this.find({ status: 'Active' });
};

module.exports = mongoose.model('Instrument', InstrumentSchema);