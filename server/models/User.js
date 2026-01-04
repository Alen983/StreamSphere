const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    preferences: {
      favoriteGenres: [
        {
          type: String,
          trim: true,
        },
      ],
      favoriteLanguages: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    watchlist: [
      {
        mediaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Media",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    watchHistory: [
      {
        mediaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Media",
          required: true,
        },
        // For series - track which episode was watched
        seasonNumber: {
          type: Number,
          default: null,
        },
        episodeNumber: {
          type: Number,
          default: null,
        },
        // Progress tracking
        progress: {
          type: Number, // percentage watched (0-100)
          default: 0,
          min: 0,
          max: 100,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        lastWatchedAt: {
          type: Date,
          default: Date.now,
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for efficient querying
// userSchema.index({ email: 1 });
userSchema.index({ "watchlist.mediaId": 1 });
userSchema.index({ "watchHistory.mediaId": 1 });

// Virtual for watchlist count
userSchema.virtual("watchlistCount").get(function () {
  return this.watchlist.length;
});

// Method to add to watchlist
userSchema.methods.addToWatchlist = function (mediaId) {
  const exists = this.watchlist.some(
    (item) => item.mediaId.toString() === mediaId.toString()
  );

  if (!exists) {
    this.watchlist.push({ mediaId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove from watchlist
userSchema.methods.removeFromWatchlist = function (mediaId) {
  this.watchlist = this.watchlist.filter(
    (item) => item.mediaId.toString() !== mediaId.toString()
  );
  return this.save();
};

// Method to add/update watch history
userSchema.methods.addToWatchHistory = function (
  mediaId,
  seasonNumber = null,
  episodeNumber = null,
  progress = 0,
  completed = false
) {
  // Find existing entry for this media and episode combination
  const existingIndex = this.watchHistory.findIndex((item) => {
    const sameMedia = item.mediaId.toString() === mediaId.toString();

    // For movies (no season/episode)
    if (!seasonNumber && !episodeNumber) {
      return sameMedia && !item.seasonNumber && !item.episodeNumber;
    }

    // For series episodes
    return (
      sameMedia &&
      item.seasonNumber === seasonNumber &&
      item.episodeNumber === episodeNumber
    );
  });

  if (existingIndex !== -1) {
    // Update existing entry
    this.watchHistory[existingIndex].progress = progress;
    this.watchHistory[existingIndex].completed = completed;
    this.watchHistory[existingIndex].lastWatchedAt = Date.now();
  } else {
    // Add new entry
    this.watchHistory.push({
      mediaId,
      seasonNumber,
      episodeNumber,
      progress,
      completed,
      lastWatchedAt: Date.now(),
      watchedAt: Date.now(),
    });
  }

  return this.save();
};

// Method to get continue watching (incomplete items)
userSchema.methods.getContinueWatching = function () {
  return this.watchHistory
    .filter((item) => !item.completed && item.progress > 0)
    .sort((a, b) => b.lastWatchedAt - a.lastWatchedAt)
    .slice(0, 10); // Return top 10 recent
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
