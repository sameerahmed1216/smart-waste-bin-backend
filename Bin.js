const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  battery: {
    type: Number, // Battery level in %
    required: false,
  },
  temperature: {
    type: Number, // In °C
    required: false,
  },
  status: {
    type: String,
    default: 'normal', // normal / full / maintenance
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Bin', binSchema);
