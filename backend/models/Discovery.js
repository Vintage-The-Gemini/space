const mongoose = require('mongoose');

const DiscoverySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
    type: String,
    required: [true, 'Please specify the type of discovery'],
    enum: [
      'Exoplanet',
      'Star',
      'Galaxy',
      'Nebula',
      'BlackHole',
      'Asteroid',
      'Comet',
      'Other'
    ]
  },
  coordinates: {
    rightAscension: {
      type: String,
      required: [true, 'Please add right ascension coordinates']
    },
    declination: {
      type: String,
      required: [true, 'Please add declination coordinates']
    },
    distance: {
      value: Number,
      unit: {
        type: String,
        enum: ['ly', 'au', 'pc'],
        default: 'ly'
      }
    }
  },
  discoveryDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  instrument: {
    type: mongoose.Schema.ObjectId,
    ref: 'Instrument',
    required: true
  },
  characteristics: {
    mass: {
      value: Number,
      unit: String
    },
    size: {
      value: Number,
      unit: String
    },
    temperature: {
      value: Number,
      unit: String
    },
    composition: [String],
    spectralType: String
  },
  significance: {
    type: String,
    required: [true, 'Please explain the significance of this discovery']
  },
  verificationStatus: {
    type: String,
    enum: ['Unverified', 'Pending', 'Verified', 'Disputed'],
    default: 'Unverified'
  },
  publications: [{
    title: String,
    authors: [String],
    journalName: String,
    publicationDate: Date,
    doi: String
  }],
  images: [{
    url: String,
    caption: String,
    dateAdded: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for improved query performance
DiscoverySchema.index({ type: 1, discoveryDate: -1 });
DiscoverySchema.index({ verificationStatus: 1 });
DiscoverySchema.index({ 'coordinates.distance.value': 1 });

// Middleware to update instrument's discoveryCount
DiscoverySchema.post('save', async function(doc) {
  try {
    const Instrument = this.model('Instrument');
    await Instrument.findByIdAndUpdate(
      doc.instrument,
      { $inc: { discoveryCount: 1 } }
    );
  } catch (err) {
    console.error('Error updating instrument discovery count:', err);
  }
});

// Virtual to calculate age of discovery
DiscoverySchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.discoveryDate) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Discovery', DiscoverySchema);