const mongoose = require("mongoose");
const { episodeSchema } = require("./Episode");

// Media Schema
const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["movie", "series"],
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
        index: true,
      },
    ],
    releaseDate: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number, // for movies, in minutes
      default: null,
    },
    posterUrl: {
      type: String,
      default: "",
    },
    sliderPosterUrl: {
      type: String,
      default: "",
    },
    trailerUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    director: {
      type: String,
      default: "",
      trim: true,
    },
    cast: [
      {
        type: String,
        trim: true,
      },
    ],
    country: {
      type: String,
      default: "",
      trim: true,
    },
    ageRating: {
      type: String,
      default: "",
      trim: true,
    },
    episodes: [episodeSchema], // embedded subdocuments for series
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Remove episodes field from movies in API responses
        if (ret.type === "movie") {
          delete ret.episodes;
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        // Also remove episodes when converting to object
        if (ret.type === "movie") {
          delete ret.episodes;
        }
        return ret;
      },
    },
  }
);

// Indexes for efficient querying
mediaSchema.index({ type: 1, genres: 1 });
mediaSchema.index({ rating: -1 });
mediaSchema.index({ releaseDate: -1 });

// Virtual for total episodes (for series)
mediaSchema.virtual("totalEpisodes").get(function () {
  return this.episodes.length;
});

// Virtual for seasons count (for series)
mediaSchema.virtual("totalSeasons").get(function () {
  if (this.episodes.length === 0) return 0;
  return Math.max(...this.episodes.map((ep) => ep.seasonNumber));
});

// Export models
const Media = mongoose.model("Media", mediaSchema);

module.exports = { Media };
