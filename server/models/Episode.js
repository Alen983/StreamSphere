const mongoose = require('mongoose');

// Episode Schema
const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: true
  },
  seasonNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient querying
episodeSchema.index({ seasonNumber: 1, episodeNumber: 1 });

const Episode = mongoose.model('Episode', episodeSchema);
module.exports = { Episode, episodeSchema };