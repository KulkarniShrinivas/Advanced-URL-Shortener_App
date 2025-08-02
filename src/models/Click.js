const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'URL',
    required: true,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  osType: {
    type: String,
  },
  deviceType: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Click', ClickSchema);