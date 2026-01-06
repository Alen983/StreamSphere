// backend/models/Watchlist.js
const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media", // or whatever your media collection is called
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound unique index to prevent duplicate entries
watchlistSchema.index({ userId: 1, mediaId: 1 }, { unique: true });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = { Watchlist };
